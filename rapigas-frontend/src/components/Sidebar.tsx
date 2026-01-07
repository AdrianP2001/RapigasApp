import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

interface SidebarProps {
    mobileOpen: boolean;
    setMobileOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState<{ nombre: string; rol: string } | null>(null);
    const [alertasCount, setAlertasCount] = useState(0);

    // 1. Cargar Usuario y Alertas al montar
    useEffect(() => {
        // Cargar usuario del storage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch (e) {
                console.error("Error leyendo usuario", e);
            }
        }

        // Cargar conteo de alertas (Simulado o real)
        const fetchAlertas = async () => {
            try {
                const res = await api.get('/alertas');
                // Filtramos solo las que tienen días <= 2
                const urgentes = res.data.filter((a: any) => a.dias <= 2).length;
                setAlertasCount(urgentes);
            } catch (error) {
                console.error("Error fetching alertas", error);
            }
        };

        fetchAlertas();
        // Opcional: Polling cada 60seg
        const interval = setInterval(fetchAlertas, 60000);
        return () => clearInterval(interval);
    }, []);

    const cerrarSesion = () => {
        if (window.confirm("¿Cerrar sesión?")) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    const menuItems = [
        { path: '/dashboard', label: 'Inicio', icono: '🏠', color: 'transparent' },
        { path: '/ventas', label: 'Nueva Venta', icono: '🛒', color: 'transparent' },
        { path: '/alertas', label: 'Alertas', icono: '⚠️', color: 'transparent', badge: true }, // Flag para badge
        { path: '/clientes', label: 'Clientes', icono: '👥', color: 'transparent' },
        { path: '/historial', label: 'Historial', icono: '📜', color: 'transparent' },
        { path: '/productos', label: 'Productos', icono: '📦', color: 'transparent' },
    ];

    return (
        <>
            {mobileOpen && <div style={styles.overlay} onClick={() => setMobileOpen(false)} />}

            <div style={{
                ...styles.sidebar,
                transform: mobileOpen ? 'translateX(0)' : undefined,
                left: mobileOpen ? 0 : (window.innerWidth < 768 ? '-260px' : 0) // Ancho ajustado
            }}>

                {/* --- LOGO Y USUARIO --- */}
                <div style={styles.logoArea}>
                    <h2 style={{ color: 'white', margin: 0, letterSpacing: '2px' }}>RAPIGAS</h2>
                    <small style={{ color: '#aaa' }}>v2.2 Web</small>

                    {/* Información del Usuario */}
                    {user && (
                        <div style={styles.userInfo}>
                            <div style={{ fontWeight: 'bold', color: 'white' }}>👤 {user.nombre || 'Admin'}</div>
                            <div style={{ fontSize: '12px', color: '#2ecc71' }}>{user.rol || 'Administrador'}</div>
                        </div>
                    )}
                </div>

                {/* --- NAVEGACIÓN --- */}
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
                                    opacity: activo ? 1 : 0.8,
                                    position: 'relative' // Necesario para el badge
                                }}
                            >
                                <span style={{ marginRight: '15px', fontSize: '18px' }}>{item.icono}</span>
                                {item.label}

                                {/* BADGE DE NOTIFICACIONES */}
                                {item.badge && alertasCount > 0 && (
                                    <span style={styles.badge}>{alertasCount}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <button onClick={cerrarSesion} style={styles.btnLogout}>
                    🚪 Cerrar Sesión
                </button>
            </div>
        </>
    );
};

const styles = {
    sidebar: {
        width: '260px',
        height: '100vh',
        backgroundColor: '#2B2B2B',
        display: 'flex',
        flexDirection: 'column' as const,
        padding: '20px',
        boxSizing: 'border-box' as const,
        position: 'fixed' as const,
        top: 0,
        zIndex: 1000,
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Transición más suave
        borderRight: '1px solid #333',
        boxShadow: '4px 0 10px rgba(0,0,0,0.3)'
    },
    logoArea: {
        textAlign: 'center' as const,
        marginBottom: '10px',
        paddingBottom: '10px',
        borderBottom: '1px solid #444',
    },
    userInfo: {
        marginTop: '15px',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #444'
    },
    nav: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '5px',
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
        fontSize: '15px'
    },
    badge: {
        backgroundColor: '#e74c3c',
        color: 'white',
        borderRadius: '12px',
        padding: '2px 8px',
        fontSize: '11px',
        fontWeight: 'bold',
        position: 'absolute' as const,
        right: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
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
        width: '100%'
    },
    overlay: {
        position: 'fixed' as const,
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(2px)', // Efecto borroso de fondo
        zIndex: 900
    }
};

export default Sidebar;