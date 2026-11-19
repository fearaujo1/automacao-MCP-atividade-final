import type { Database, Status, Priority } from '../types/index.ts';

/** Base fictícia reproduzindo os nomes e as quantidades do Figma. */
export function seedDatabase(): Database {
  const users: Database['users'] = [
    { id: 'u1', name: 'Felipe Araujo', email: 'felipe@example.com', role: 'Administrador', active: true },
    { id: 'u2', name: 'Marina Costa', email: 'marina@example.com', role: 'Técnico', active: true },
    { id: 'u3', name: 'Lucas Ribeiro', email: 'lucas@example.com', role: 'Técnico', active: true },
    { id: 'u4', name: 'Pedro Almeida', email: 'pedro@example.com', role: 'Técnico', active: true },
  ];
  const rows = [
    ['Alimentos Aurora', 'Ana Lima', 'ana', 'Londrina'],
    ['Bebidas Horizonte', 'Bruno Reis', 'bruno', 'Maringá'],
    ['Indústria Vale Verde', 'Carla Alves', 'carla', 'Rolândia'],
    ['Café Montanha', 'Diego Silva', 'diego', 'Cambé'],
    ['Embalagens Prisma', 'Elisa Rocha', 'elisa', 'Londrina'],
    ['Laticínios Campo', 'Fabio Dias', 'fabio', 'Arapongas'],
    ['Doces Estação', 'Gabi Melo', 'gabi', 'Apucarana'],
    ['Grãos Nascente', 'Heitor Luz', 'heitor', 'Ibiporã'],
  ];
  const clients = rows.map(([name, contact, email, city], i) => ({ id: `c${i+1}`, name, contact, email: `${email}@example.com`, city: `${city} – PR`, phone: '(43) 3000-0000', active: i !== 6 }));
  const examples: [number, string, string, string, Priority, Status, string][] = [
    [12,'c1','Domino AX150','Falha de impressão durante o ciclo','Alta','Aberto',''],
    [11,'c2','Robopac Masterplat','Falha no tensionamento do filme','Média','Em atendimento','u2'],
    [10,'c3','Minipack X1','Substituição de resistência de selagem','Alta','Aguardando peça','u3'],
    [9,'c4','Domino CX350','Ajuste de qualidade da impressão','Baixa','Concluído','u4'],
    [8,'c5','Bandall','Revisão do sistema de alimentação','Média','Em atendimento','u2'],
    [7,'c6','Robot S7','Ciclo de envolvimento interrompido','Alta','Aberto',''],
    [6,'c8','Domino AX150','Inspeção preventiva do cabeçote','Baixa','Aberto','u4'],
    [5,'c1','Domino AX350','Verificação de sensor da linha','Média','Aberto','u2'],
    [4,'c2','Robot S7','Ajuste de velocidade do equipamento','Média','Em atendimento','u3'],
    [3,'c3','Bandall','Aguardando conjunto de tração','Alta','Aguardando peça','u3'],
    [2,'c7','Minipack X1','Revisão preventiva concluída','Baixa','Concluído','u4'],
    [1,'c8','Domino CX350','Limpeza e calibração de impressão','Baixa','Concluído','u4'],
  ];
  const tickets = examples.map(([n,clientId,equipment,title,priority,status,assigneeId]) => ({
    id: `t${n}`, protocol: `AUT-${String(n).padStart(4,'0')}`, clientId, equipment, title,
    description: n === 11 ? 'O equipamento interrompe o ciclo de envolvimento ao tensionar o filme. Solicitação de avaliação técnica na linha de embalagem.' : `Solicitação de assistência técnica: ${title.toLocaleLowerCase('pt-BR')}.`,
    priority, status, assigneeId, createdAt: `2026-11-16T${String(8).padStart(2,'0')}:${String(29+n).padStart(2,'0')}:00-03:00`, updatedAt: '2026-11-16T09:30:00-03:00',
  }));
  const history: Database['history'] = tickets.flatMap(t => [
    { id: `h-${t.id}`, ticketId: t.id, authorId: 'u1', title: 'Chamado aberto', message: `Solicitação registrada para ${clients.find(c=>c.id===t.clientId)?.name}.`, createdAt: t.createdAt },
    ...(t.status !== 'Aberto' ? [{ id: `hs-${t.id}`, ticketId:t.id, authorId:t.assigneeId, title:t.status, message:t.status === 'Concluído' ? 'Equipamento revisado e funcionamento validado. Atendimento concluído.' : 'Responsável definido. Atendimento técnico em andamento.', createdAt:'2026-11-16T09:05:00-03:00' }] : []),
  ]);
  history.push({ id:'h-diag', ticketId:'t11', authorId:'u2', title:'Diagnóstico iniciado', message:'Verificação do conjunto de tensionamento e dos ajustes do filme.', createdAt:'2026-11-16T09:30:00-03:00' });
  return { version:1, nextProtocol:13, users, clients, tickets, history };
}
