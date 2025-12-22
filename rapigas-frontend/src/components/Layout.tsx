import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast'; // <--- IMPORTAR

// Hook personalizado para detectar tamaño de pantalla (Optimización sugerida)
const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return isMobile;
};

const Layout: React.FC = () => {
    const isMobile = useIsMobile();
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    // Cerrar sidebar automáticamente al cambiar de ruta en móvil
    useEffect(() => {
        if (isMobile) setMobileOpen(false);
    }, [location.pathname, isMobile]);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#1a1a1a', overflowX: 'hidden' }}>

            {/* Sidebar (Controlada por estado en móvil, Fija en PC) */}
            <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

            {/* Contenido Principal */}
            <div style={{
                flex: 1,
                // Transición suave al abrir/cerrar o cambiar tamaño
                marginLeft: isMobile ? 0 : '260px',
                transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}>

                {/* Header Móvil */}
                {isMobile && (
                    <div style={styles.mobileHeader}>
                        <button
                            onClick={() => setMobileOpen(true)}
                            style={styles.hamburgerBtn}
                            aria-label="Abrir menú"
                        >
                            ☰
                        </button>
                        <h3 style={{ margin: 0, color: 'white', letterSpacing: '1px' }}>RAPIGAS</h3>
                        <div style={{ width: 30 }} /> {/* Espaciador para centrar título */}
                    </div>
                )}

                {/* AQUÍ SE CARGAN LAS PÁGINAS */}
                <main style={{ padding: isMobile ? '15px' : '0', flex: 1, position: 'relative' }}>
                    <Outlet />
                </main>
            </div>
            <Toaster position="top-center" reverseOrder={false} />
        </div>
    );
};

const styles = {
    mobileHeader: {
        padding: '15px 20px',
        backgroundColor: '#2B2B2B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        position: 'sticky' as const,
        top: 0,
        zIndex: 100
    },
    hamburgerBtn: {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '24px',
        cursor: 'pointer',
        padding: '0 5px'
    }
};

export default Layout;