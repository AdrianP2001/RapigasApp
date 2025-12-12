import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

// CORRECCIÓN: Cambiamos 'JSX.Element' por 'React.ReactElement' (o React.ReactNode)
// Esto soluciona el error TS2503 porque usamos el 'React' que ya importamos arriba.
const RutaPrivada = ({ children }: { children: React.ReactElement }) => {
  const token = localStorage.getItem('token');
  // Si hay token, renderiza el hijo (children); si no, redirige al Login.
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
            {/* Contenido protegido */}
            <div style={{ color: 'black', padding: 20 }}>
              <h1>¡Bienvenido al Dashboard de Rapigas!</h1>
              <p>Has iniciado sesión correctamente.</p>
            </div>
          </RutaPrivada>
        } />

        {/* Redireccionar rutas desconocidas */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;