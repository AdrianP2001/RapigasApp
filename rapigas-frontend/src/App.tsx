import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

// Componente para proteger rutas (lo usaremos luego para el Dashboard)
const RutaPrivada = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Login */}
        <Route path="/login" element={<Login />} />

        {/* Ruta Dashboard (Protegida) */}
        <Route path="/dashboard" element={
          <RutaPrivada>
            {/* Aquí pondremos tu Dashboard real pronto */}
            <div style={{ color: 'black', padding: 20 }}>
              <h1>¡Bienvenido al Dashboard de Rapigas!</h1>
              <p>Has iniciado sesión correctamente.</p>
            </div>
          </RutaPrivada>
        } />

        {/* Redireccionar cualquier ruta desconocida al Login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;