import { PRIORITIES, STATUSES } from '../types/index.ts';
import type { Database, User, ClientInput, UserInput, TicketInput, Status } from '../types/index.ts';

export class DomainError extends Error {
  constructor(message: string, public fields: Record<string, string> = {}) { super(message); this.name = 'DomainError'; }
}
export const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export const transitions: Record<Status, readonly Status[]> = {
  'Aberto': ['Em atendimento'], 'Em atendimento': ['Aguardando peça', 'Concluído'],
  'Aguardando peça': ['Em atendimento'], 'Concluído': [],
};
export function actor(db: Database, id: string): User {
  const user = db.users.find(u => u.id === id && u.active);
  if (!user) throw new DomainError('Sua sessão não está ativa. Entre novamente.');
  return user;
}
function admin(db: Database, id: string) { if (actor(db,id).role !== 'Administrador') throw new DomainError('Esta ação exige perfil de administrador.'); }
function validate(fields: Record<string,string>) { if(Object.keys(fields).length) throw new DomainError('Confira os campos destacados.', fields); }
function basic(data: Record<string,unknown>, keys: string[]) {
  return Object.fromEntries(keys.filter(k=>typeof data[k] !== 'string' || !(data[k] as string).trim()).map(k=>[k,'Este campo é obrigatório.']));
}
const emailOK = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
function technician(db: Database,id: string) { return db.users.some(u=>u.id===id&&u.active&&u.role==='Técnico'); }
const clone = (db: Database): Database => structuredClone(db);
function event(db: Database, ticketId: string, authorId: string, title: string, message: string, time: string) {
  db.history.push({id:crypto.randomUUID(),ticketId,authorId,title,message,createdAt:time});
}
export function visibleTickets(db: Database, userId: string) {
  const user=actor(db,userId);
  return db.tickets.filter(t=>user.role==='Administrador'||t.assigneeId===user.id).sort((a,b)=>b.protocol.localeCompare(a.protocol,undefined,{numeric:true}));
}
export function saveClient(db: Database, userId: string, input: ClientInput, id?: string): Database {
  admin(db,userId);
  const errors=basic({...input},['name','contact','email']);
  if(input.email&&!emailOK(input.email.trim()))errors.email='Informe um e-mail válido.';
  validate(errors);
  if(id&&!db.clients.some(c=>c.id===id))throw new DomainError('Cliente não encontrado.');
  const next=clone(db);
  const record={...input,id:id||crypto.randomUUID(),name:input.name.trim(),contact:input.contact.trim(),email:input.email.trim().toLowerCase(),phone:input.phone.trim(),city:input.city.trim()};
  if(id)next.clients=next.clients.map(c=>c.id===id?record:c);else next.clients.push(record);
  return next;
}
export function saveUser(db: Database, userId: string, input: UserInput, id?: string): Database {
  admin(db,userId);
  const errors=basic({...input},['name','email']);
  if(!emailOK(input.email.trim()))errors.email='Informe um e-mail válido.';
  if(!['Administrador','Técnico'].includes(input.role))errors.role='Selecione um perfil válido.';
  if(db.users.some(u=>u.id!==id&&u.email.trim().toLowerCase()===input.email.trim().toLowerCase()))errors.email='Este e-mail já está cadastrado.';
  validate(errors);
  const previous=db.users.find(u=>u.id===id);
  if(id&&!previous)throw new DomainError('Usuário não encontrado.');
  if(id===userId&&!input.active)throw new DomainError('Você não pode inativar o usuário da sessão.');
  if(previous?.active&&previous.role==='Administrador'&&(!input.active||input.role!=='Administrador')&&db.users.filter(u=>u.active&&u.role==='Administrador').length===1)throw new DomainError('O último administrador ativo deve ser mantido.');
  if(previous?.role==='Técnico'&&(!input.active||input.role!=='Técnico')&&db.tickets.some(t=>t.assigneeId===id&&t.status!=='Concluído'))throw new DomainError('Reatribua os chamados não concluídos antes de inativar ou alterar o perfil deste técnico.');
  const next=clone(db);
  const record={...input,id:id||crypto.randomUUID(),name:input.name.trim(),email:input.email.trim().toLowerCase()};
  if(id)next.users=next.users.map(u=>u.id===id?record:u);else next.users.push(record);
  return next;
}
export function createTicket(db: Database, userId: string, input: TicketInput): Database {
  admin(db,userId);
  const errors=basic({...input},['clientId','equipment','title','description']);
  if(!db.clients.some(c=>c.id===input.clientId&&c.active))errors.clientId='Selecione um cliente ativo.';
  if(!PRIORITIES.includes(input.priority))errors.priority='Selecione uma prioridade válida.';
  if(input.assigneeId&&!technician(db,input.assigneeId))errors.assigneeId='Selecione um técnico ativo.';
  validate(errors);
  const next=clone(db), now=new Date().toISOString();
  const counter=Math.max(db.nextProtocol,...db.tickets.map(t=>Number(t.protocol.replace('AUT-',''))+1));
  const ticket={...input,id:crypto.randomUUID(),equipment:input.equipment.trim(),title:input.title.trim(),description:input.description.trim(),protocol:`AUT-${String(counter).padStart(4,'0')}`,status:'Aberto' as const,createdAt:now,updatedAt:now};
  next.nextProtocol=counter+1;next.tickets.push(ticket);
  event(next,ticket.id,userId,'Chamado aberto',`Solicitação registrada para ${next.clients.find(c=>c.id===input.clientId)?.name}.`,now);
  if(ticket.assigneeId)event(next,ticket.id,userId,'Responsável atribuído',`Técnico: ${next.users.find(u=>u.id===ticket.assigneeId)?.name}.`,now);
  return next;
}
export function updateTicket(db: Database, userId: string, id: string, status: Status, assigneeId: string, note: string): Database {
  const user=actor(db,userId), current=db.tickets.find(t=>t.id===id);
  if(!current)throw new DomainError('Chamado não encontrado.');
  if(user.role!=='Administrador'&&current.assigneeId!==user.id)throw new DomainError('Você só pode atualizar seus próprios chamados.');
  if(current.status==='Concluído')throw new DomainError('Este chamado está concluído e não pode ser alterado.');
  if(user.role!=='Administrador'&&assigneeId!==current.assigneeId)throw new DomainError('Somente o administrador pode alterar o responsável.');
  const errors:Record<string,string>={};
  if(!STATUSES.includes(status)||(status!==current.status&&!transitions[current.status].includes(status)))errors.status='Esta transição de status não é permitida.';
  if(assigneeId&&!technician(db,assigneeId))errors.assigneeId='Selecione um técnico ativo.';
  if(status!=='Aberto'&&!technician(db,assigneeId))errors.assigneeId='Atribua um técnico ativo antes de iniciar o atendimento.';
  if(status==='Concluído'&&!note.trim())errors.note='Descreva a solução para concluir o chamado.';
  validate(errors);
  if(status===current.status&&assigneeId===current.assigneeId&&!note.trim())throw new DomainError('Altere o status, o responsável ou adicione uma observação.');
  const next=clone(db), now=new Date().toISOString();
  next.tickets=next.tickets.map(t=>t.id===id?{...t,status,assigneeId,updatedAt:now}:t);
  if(assigneeId!==current.assigneeId)event(next,id,userId,'Responsável atualizado',assigneeId?`Técnico: ${db.users.find(u=>u.id===assigneeId)?.name}.`:'O chamado ficou sem responsável.',now);
  if(status!==current.status)event(next,id,userId,'Status atualizado',`${current.status} → ${status}.`,now);
  if(note.trim())event(next,id,userId,status==='Concluído'?'Solução registrada':'Observação',note.trim(),now);
  return next;
}
