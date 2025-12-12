import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Ventas from './pages/Ventas';
import Layout from './components/Layout'; // <--- IMPORTAR
import Alertas from './pages/Alertas'; // <--- IMPORTAR
import Clientes from './pages/Clientes'; // <--- IMPORTAR 

const RutaPrivada = ({ children }: { children: React.ReactElement }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* --- RUTAS CON SIDEBAR --- */}
        {/* Usamos el Layout como "envoltorio" */}
        <Route element={<RutaPrivada><Layout /></RutaPrivada>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ventas" element={<Ventas />} />

          {/* Páginas pendientes (Placeholders por ahora) */}
          <Route path="/alertas" element={<div style={{ color: 'white', padding: 20 }}><h1>⚠️ Centro de Alertas</h1><p>Próximamente...</p></div>} />
          <Route path="/clientes" element={<div style={{ color: 'white', padding: 20 }}><h1>👥 Gestión de Clientes</h1><p>Próximamente...</p></div>} />
          <Route path="/historial" element={<div style={{ color: 'white', padding: 20 }}><h1>📜 Historial de Ventas</h1><p>Próximamente...</p></div>} />
          <Route path="/alertas" element={<Alertas />} />
          <Route path="/clientes" element={<Clientes />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 