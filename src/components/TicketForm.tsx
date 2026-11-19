import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { createTicket } from '../repositories/service';
import { PRIORITIES } from '../types';
import type { TicketInput, Priority } from '../types';
import { Modal, Field, Button, ErrorNotice, blankError, formError } from './ui';
export function TicketForm({onClose}:{onClose:()=>void}){
 const {db,user,commit}=useApp(), navigate=useNavigate();
 const [data,setData]=useState<TicketInput>({clientId:'',title:'',equipment:'',description:'',priority:'Média',assigneeId:''});
 const [error,setError]=useState(blankError);
 const set=(key:keyof TicketInput,value:string)=>setData(d=>({...d,[key]:value}));
 const submit=(e:FormEvent)=>{e.preventDefault();try{commit(current=>createTicket(current,user!.id,data),'Chamado criado com sucesso.');onClose();navigate('/chamados');}catch(err){setError(formError(err));}};
 return <Modal title="Novo chamado" description="Registre os dados para iniciar um atendimento." onClose={onClose} wide><form noValidate onSubmit={submit} className="form-stack"><ErrorNotice error={error}/><div className="form-grid"><Field label="Cliente" required autoFocus value={data.clientId} error={error.fields.clientId} onChange={e=>set('clientId',e.target.value)}><option value="">Selecione um cliente</option>{db.clients.filter(c=>c.active).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</Field><Field label="Prioridade" required value={data.priority} onChange={e=>set('priority',e.target.value as Priority)} error={error.fields.priority}>{PRIORITIES.map(p=><option key={p}>{p}</option>)}</Field></div><Field label="Equipamento" required value={data.equipment} maxLength={120} error={error.fields.equipment} placeholder="Ex.: Domino AX150" onChange={e=>set('equipment',e.target.value)}/><Field label="Título" required value={data.title} maxLength={160} error={error.fields.title} placeholder="Resuma a solicitação" onChange={e=>set('title',e.target.value)}/><Field label="Descrição" required value={data.description} rows={4} error={error.fields.description} placeholder="Descreva o problema e as condições observadas" onChange={e=>set('description',e.target.value)}/><Field label="Responsável" value={data.assigneeId} error={error.fields.assigneeId} onChange={e=>set('assigneeId',e.target.value)}><option value="">Não atribuído</option>{db.users.filter(u=>u.active&&u.role==='Técnico').map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</Field><p className="caption muted">Status inicial: Aberto · * Campos obrigatórios</p><div className="actions"><Button variant="outline" onClick={onClose}>Cancelar</Button><Button type="submit">Salvar chamado</Button></div></form></Modal>;
}
