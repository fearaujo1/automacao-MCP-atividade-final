import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider, useApp } from './state/AppContext';
import { AppLayout } from './layouts/AppLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Tickets } from './pages/Tickets';
import { TicketDetails } from './pages/TicketDetails';
import { Clients } from './pages/Clients';
import { Users } from './pages/Users';
function Protected(){const {user}=useApp();return user?<Outlet/>:<Navigate to="/login" replace/>;}
function AdminOnly(){const {user}=useApp();return user?.role==='Administrador'?<Outlet/>:<Navigate to="/" replace/>;}
export default function App(){return <AppProvider><HashRouter><Routes><Route path="/login" element={<Login/>}/><Route element={<Protected/>}><Route element={<AppLayout/>}><Route index element={<Dashboard/>}/><Route path="chamados" element={<Tickets/>}/><Route path="chamados/:id" element={<TicketDetails/>}/><Route element={<AdminOnly/>}><Route path="clientes" element={<Clients/>}/><Route path="usuarios" element={<Users/>}/></Route></Route></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes></HashRouter></AppProvider>;}
