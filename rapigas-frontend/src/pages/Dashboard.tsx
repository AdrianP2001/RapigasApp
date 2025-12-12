import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

// Definimos la estructura de los datos
interface ResumenData {
    ventas_hoy: number;
    cantidad_gas: number;
    cantidad_agua: number;
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [resumen, setResumen] = useState<ResumenData>({ ventas_hoy: 0, cantidad_gas: 0, cantidad_agua: 0 });
    const [alertasCount, setAlertasCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // 1. Cargar Resumen Ventas
                const resVentas = await api.get('/dashboard');
                setResumen(resVentas.data);

                // 2. Cargar Alertas (Solo necesitamos contar cuántas hay)
                const resAlertas = await api.get('/alertas');
                if (Array.isArray(resAlertas.data)) {
                    setAlertasCount(resAlertas.data.length);
                }
            } catch (error) {
                console.error("Error cargando datos:", error);
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) return <div style={styles.container}><h2 style={{ color: 'white' }}>Cargando...</h2></div>;

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>Resumen del Día</h1>
            </div>

            {/* Grid de Tarjetas */}
            <div style={styles.grid}>

                {/* Tarjeta Ventas */}
                <Card
                    titulo="Ventas Hoy"
                    valor={`$ ${Number(resumen.ventas_hoy).toFixed(2)}`}
                    color="#2B2B2B"
                    icono="💰"
                />

                {/* Tarjeta Alertas */}
                <Card
                    titulo="Alertas Pendientes"
                    valor={alertasCount.toString()}
                    color={alertasCount > 0 ? "#aa0000" : "gray"} // Rojo si hay alertas, gris si no
                    icono="⚠️"
                    onClick={() => console.log("Ir a alertas...")}
                />

                {/* Tarjeta Gas */}
                <Card
                    titulo="Gas Vendido"
                    valor={`${resumen.cantidad_gas} unds`}
                    color="#E67E22" // Naranja
                    icono="🔥"
                />

                {/* Tarjeta Agua */}
                <Card
                    titulo="Agua Vendida"
                    valor={`${resumen.cantidad_agua} unds`}
                    color="#3498DB" // Azul
                    icono="💧"
                />
            </div>
        </div>
    );
};

// Componente reutilizable para las tarjetas
const Card = ({ titulo, valor, color, icono, onClick }: any) => (
    <div
        onClick={onClick}
        style={{
            ...styles.card,
            backgroundColor: color,
            cursor: onClick ? 'pointer' : 'default'
        }}
    >
        <div style={{ fontSize: '30px', marginBottom: '10px' }}>{icono}</div>
        <h3 style={{ margin: '0 0 10px 0', fontWeight: 'normal', opacity: 0.8 }}>{titulo}</h3>
        <span style={{ fontSize: '32px', fontWeight: 'bold' }}>{valor}</span>
    </div>
);

// Estilos CSS-in-JS
const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#1a1a1a',
        color: 'white',
        padding: '40px',
        boxSizing: 'border-box' as const,
        fontFamily: 'Arial, sans-serif'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        borderBottom: '1px solid #333',
        paddingBottom: '20px'
    },
    title: {
        margin: 0,
        fontSize: '28px'
    },
    logoutBtn: {
        backgroundColor: '#c0392b',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // Responsive automático
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    card: {
        borderRadius: '15px',
        padding: '30px',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        transition: 'transform 0.2s ease',
        height: '200px'
    }
};

export default Dashboard;