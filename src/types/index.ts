export const STATUSES = ['Aberto', 'Em atendimento', 'Aguardando peça', 'Concluído'] as const;
export type Status = typeof STATUSES[number];
export const PRIORITIES = ['Baixa', 'Média', 'Alta'] as const;
export type Priority = typeof PRIORITIES[number];
export type Role = 'Administrador' | 'Técnico';
export interface User { id: string; name: string; email: string; role: Role; active: boolean }
export interface Client { id: string; name: string; contact: string; email: string; phone: string; city: string; active: boolean }
export interface Ticket { id: string; protocol: string; clientId: string; equipment: string; title: string; description: string; priority: Priority; status: Status; assigneeId: string; createdAt: string; updatedAt: string }
export interface HistoryEntry { id: string; ticketId: string; authorId: string; title: string; message: string; createdAt: string }
export interface Database { version: 1; nextProtocol: number; users: User[]; clients: Client[]; tickets: Ticket[]; history: HistoryEntry[] }
export type ClientInput = Omit<Client, 'id'>;
export type UserInput = Omit<User, 'id'>;
export type TicketInput = Pick<Ticket, 'clientId' | 'equipment' | 'title' | 'description' | 'priority' | 'assigneeId'>;
