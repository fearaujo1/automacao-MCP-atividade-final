import { Link } from 'react-router-dom';
import type { Ticket } from '../types';
import { useApp } from '../state/AppContext';
import { EmptyState } from './ui';
export function TicketTable({tickets,compact=false}:{tickets:Ticket[];compact?:boolean}){const {db}=useApp();if(!tickets.length)return <EmptyState/>;return <div className="table-scroll"><table className={`ticket-table ${compact?'compact':''}`}><caption className="sr-only">Lista de chamados técnicos</caption><thead><tr>{['Protocolo','Cliente','Equipamento','Prioridade','Status','Responsável'].map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{tickets.map(t=><tr key={t.id}><td><Link to={`/chamados/${t.id}`}>{t.protocol}</Link></td><td>{db.clients.find(c=>c.id===t.clientId)?.name||'Cliente indisponível'}</td><td>{t.equipment}</td><td>{t.priority}</td><td>{t.status}</td><td>{db.users.find(u=>u.id===t.assigneeId)?.name||'Não atribuído'}</td></tr>)}</tbody></table></div>;}
