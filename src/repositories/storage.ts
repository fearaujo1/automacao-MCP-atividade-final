import type { Database } from '../types/index.ts';
import { STATUSES, PRIORITIES } from '../types/index.ts';
import { seedDatabase } from '../data/seed.ts';
export const DATABASE_KEY='autopack-service:database:v1';
export const SESSION_KEY='autopack-service:session';
/** Não substitui uma base inválida silenciosamente. O usuário decide restaurá-la. */
export function parseDatabase(raw: string): Database {
  const db=JSON.parse(raw) as Database;
  const str=(o:unknown,keys:string[])=>!!o&&typeof o==='object'&&keys.every(k=>typeof (o as Record<string,unknown>)[k]==='string');
  if(!db||db.version!==1||!Number.isSafeInteger(db.nextProtocol)||db.nextProtocol<1||
    !Array.isArray(db.users)||!db.users.every(u=>str(u,['id','name','email','role'])&&typeof u.active==='boolean'&&['Administrador','Técnico'].includes(u.role))||
    !Array.isArray(db.clients)||!db.clients.every(c=>str(c,['id','name','contact','email','phone','city'])&&typeof c.active==='boolean')||
    !Array.isArray(db.tickets)||!db.tickets.every(t=>str(t,['id','protocol','clientId','equipment','title','description','assigneeId','createdAt','updatedAt'])&&STATUSES.includes(t.status)&&PRIORITIES.includes(t.priority))||
    !Array.isArray(db.history)||!db.history.every(h=>str(h,['id','ticketId','authorId','title','message','createdAt']))||
    !db.users.some(u=>u.active&&u.role==='Administrador'))throw new Error('Formato de dados não reconhecido.');
  return db;
}
export function readDatabase(storage: Storage = localStorage): Database {
  const raw=storage.getItem(DATABASE_KEY);
  if(raw!==null)return parseDatabase(raw);
  const initial=seedDatabase();writeDatabase(initial,storage);return initial;
}
export function writeDatabase(db:Database,storage:Storage=localStorage){storage.setItem(DATABASE_KEY,JSON.stringify(db));}
