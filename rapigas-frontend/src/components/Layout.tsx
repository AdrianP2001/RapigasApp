import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Detectar cambio de tamaño de pantalla
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#1a1a1a' }}>

            {/* Sidebar: Siempre visible en PC, controlada en móvil */}
            {(!isMobile || mobileOpen) && (
                <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
            )}

            {/* Contenido Principal */}
            <div style={{
                flex: 1,
                marginLeft: isMobile ? 0 : '250px', // Deja espacio en PC
                transition: 'margin 0.3s',
                width: '100%' // Asegura que ocupe todo el ancho disponible
            }}>

                {/* Barra Superior solo para Móvil (Botón Hamburguesa) */}
                {isMobile && (
                    <div style={{
                        padding: '15px',
                        backgroundColor: '#2B2B2B',
                        display: 'flex',
                        alignItems: 'center',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}>
                        <button
                            onClick={() => setMobileOpen(true)}
                            style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}
                        >
                            ☰
                        </button>
                        <h3 style={{ margin: '0 0 0 15px', color: 'white' }}>Rapigas</h3>
                    </div>
                )}

                {/* AQUÍ SE INYECTAN TUS PÁGINAS (Ventas, Dashboard, etc.) */}
                <Outlet />

            </div>
        </div>
    );
};

export default Layout;