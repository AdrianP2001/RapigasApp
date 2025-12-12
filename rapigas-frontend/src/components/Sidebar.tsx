import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
    mobileOpen: boolean;
    setMobileOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Menú idéntico a tu Python main.py
    const menuItems = [
        { path: '/dashboard', label: 'Inicio', icono: '🏠', color: 'transparent' },
        { path: '/ventas', label: 'Nueva Venta', icono: '🛒', color: '#27ae60' }, // Verde
        { path: '/alertas', label: 'Alertas', icono: '⚠️', color: 'transparent' },
        { path: '/clientes', label: 'Clientes', icono: '👥', color: 'transparent' },
        { path: '/historial', label: 'Historial', icono: '📜', color: '#D35400' }, // Naranja Quemado
    ];

    return (
        <>
            {/* Fondo oscuro para cerrar en móvil */}
            {mobileOpen && <div style={styles.overlay} onClick={() => setMobileOpen(false)} />}

            <div style={{
                ...styles.sidebar,
                transform: mobileOpen ? 'translateX(0)' : undefined, // En móvil se desliza
                left: mobileOpen ? 0 : (window.innerWidth < 768 ? '-250px' : 0) // Oculto en móvil por defecto
            }}>

                {/* Logo / Título */}
                <div style={styles.logoArea}>
                    <h2 style={{ color: 'white', margin: 0, letterSpacing: '2px' }}>RAPIGAS</h2>
                    <small style={{ color: '#aaa' }}>Sistema Web</small>
                </div>

                {/* Navegación */}
                <nav style={styles.nav}>
                    {menuItems.map((item) => {
                        const activo = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setMobileOpen(false)}
                                style={{
                                    ...styles.link,
                                    backgroundColor: activo ? '#444' : item.color,
                                    borderLeft: activo ? '4px solid #3498DB' : '4px solid transparent',
                                    opacity: activo ? 1 : 0.8
                                }}
                            >
                                <span style={{ marginRight: '15px', fontSize: '18px' }}>{item.icono}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Botón Salir */}
                <button onClick={cerrarSesion} style={styles.btnLogout}>
                    🚪 Cerrar Sesión
                </button>
            </div>
        </>
    );
};

const styles = {
    sidebar: {
        width: '250px',
        height: '100vh',
        backgroundColor: '#2B2B2B',
        display: 'flex',
        flexDirection: 'column' as const,
        padding: '20px',
        boxSizing: 'border-box' as const,
        position: 'fixed' as const,
        top: 0,
        zIndex: 1000,
        transition: 'left 0.3s ease', // Animación suave
        borderRight: '1px solid #333'
    },
    logoArea: {
        textAlign: 'center' as const,
        marginBottom: '40px',
        paddingBottom: '20px',
        borderBottom: '1px solid #444',
        marginTop: '10px'
    },
    nav: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '10px',
        flex: 1
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 15px',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: '500',
        transition: 'all 0.2s',
        fontSize: '16px'
    },
    btnLogout: {
        backgroundColor: '#c0392b',
        color: 'white',
        border: 'none',
        padding: '12px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop: '20px',
        textAlign: 'center' as const,
        fontSize: '16px'
    },
    overlay: {
        position: 'fixed' as const,
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 900
    }
};

export default Sidebar;