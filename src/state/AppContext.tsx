import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Database, User } from '../types';
import { DATABASE_KEY, SESSION_KEY, readDatabase, writeDatabase } from '../repositories/storage';
import { DomainError } from '../repositories/service';
import { seedDatabase } from '../data/seed';

type Context = { db:Database; user:User|null; login:(id:string)=>void; logout:()=>void; commit:(fn:(db:Database)=>Database,message:string)=>void; notify:(message:string)=>void; reset:()=>void };
const AppContext=createContext<Context|null>(null);
export function AppProvider({children}:{children:ReactNode}){
  const [loaded,setLoaded]=useState<{db:Database|null;error:string}>(()=>{try{return {db:readDatabase(),error:''};}catch{return {db:null,error:'Não foi possível ler os dados locais. Eles podem estar corrompidos ou o armazenamento do navegador está indisponível.'};}});
  const [session,setSession]=useState(()=>{try{return sessionStorage.getItem(SESSION_KEY)||'';}catch{return '';}});
  const [notice,setNotice]=useState('');
  const [recoveryConfirm,setRecoveryConfirm]=useState(false);
  const notify=useCallback((message:string)=>setNotice(message),[]);
  useEffect(()=>{if(!notice)return;const t=setTimeout(()=>setNotice(''),6000);return()=>clearTimeout(t);},[notice]);
  useEffect(()=>{const update=(e:StorageEvent)=>{if(e.key===DATABASE_KEY){try{setLoaded({db:readDatabase(),error:''});}catch{setLoaded({db:null,error:'Os dados locais foram alterados para um formato inválido.'});}}};window.addEventListener('storage',update);return()=>window.removeEventListener('storage',update);},[]);
  const login=(id:string)=>{if(!loaded.db?.users.some(u=>u.id===id&&u.active))throw new DomainError('Selecione um usuário ativo.');try{sessionStorage.setItem(SESSION_KEY,id);}catch{throw new DomainError('Não foi possível iniciar a sessão neste navegador.');}setSession(id);};
  const logout=()=>{try{sessionStorage.removeItem(SESSION_KEY);}catch{/* Estado em memória ainda permite encerrar a sessão. */}setSession('');};
  const reset=()=>{const fresh=seedDatabase();try{writeDatabase(fresh);setLoaded({db:fresh,error:''});setRecoveryConfirm(false);if(!fresh.users.some(u=>u.id===session))logout();notify('Dados de demonstração restaurados.');}catch{throw new DomainError('Não foi possível gravar os dados. Verifique as permissões do navegador.');}};
  const commit=(fn:(db:Database)=>Database,message:string)=>{try{const next=fn(readDatabase());writeDatabase(next);setLoaded({db:next,error:''});notify(message);}catch(e){if(e instanceof DomainError)throw e;throw new DomainError('Não foi possível salvar os dados no navegador. Verifique o armazenamento disponível.');}};
  if(!loaded.db)return <main className="recovery"><section className="card stack"><h1>Não foi possível abrir a base</h1><p>{loaded.error}</p><p>Os dados existentes não foram substituídos.</p>{!recoveryConfirm?<button className="btn" onClick={()=>setRecoveryConfirm(true)}>Restaurar demonstração</button>:<><p role="alert">Isso apagará os dados locais deste protótipo e restaurará os exemplos. Deseja continuar?</p><div className="actions"><button className="btn btn-outline" onClick={()=>setRecoveryConfirm(false)}>Cancelar</button><button className="btn danger" onClick={()=>{try{reset();}catch(e){setNotice((e as Error).message);}}}>Confirmar restauração</button></div></>}{notice&&<p role="alert">{notice}</p>}</section></main>;
  const user=loaded.db.users.find(u=>u.id===session&&u.active)||null;
  return <AppContext.Provider value={{db:loaded.db,user,login,logout,commit,notify,reset}}>{children}{notice&&<div className="toast" role="status"><span>{notice}</span><button aria-label="Fechar notificação" onClick={()=>setNotice('')}>×</button></div>}</AppContext.Provider>;
}
export function useApp(){const value=useContext(AppContext);if(!value)throw new Error('AppProvider ausente');return value;}
