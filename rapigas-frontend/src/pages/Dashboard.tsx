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
                const resVentas = await api.get('/dashboard');
                setResumen(resVentas.data);

                const resAlertas = await api.get('/alertas');
                if (Array.isArray(resAlertas.data)) {
                    // Filtramos para contar solo las urgentes (ej: 2 días o menos) o todas
                    // Aquí contamos todas las que devuelve el endpoint
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

    // ❌ ELIMINADO: handleLogout (El botón está en el Sidebar)

    if (loading) return <div style={styles.container}><h2 style={{ color: 'white' }}>Cargando...</h2></div>;

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>Resumen del Día</h1>
            </div>

            {/* Grid de Tarjetas */}
            <div style={styles.grid}>

                {/* Tarjeta Ventas (Click -> Ir a Historial) */}
                <Card
                    titulo="Ventas Hoy"
                    valor={`$ ${Number(resumen.ventas_hoy).toFixed(2)}`}
                    color="#2B2B2B"
                    icono="💰"
                    onClick={() => navigate('/historial')} // ✅ AHORA ES ÚTIL
                />

                {/* Tarjeta Alertas (Click -> Ir a Alertas) */}
                <Card
                    titulo="Alertas Pendientes"
                    valor={alertasCount.toString()}
                    color={alertasCount > 0 ? "#aa0000" : "gray"} 
                    icono="⚠️"
                    onClick={() => navigate('/alertas')} // ✅ AHORA ES ÚTIL
                />

                {/* Tarjeta Gas */}
                <Card
                    titulo="Gas Vendido"
                    valor={`${resumen.cantidad_gas} unds`}
                    color="#E67E22" 
                    icono="🔥"
                />

                {/* Tarjeta Agua */}
                <Card
                    titulo="Agua Vendida"
                    valor={`${resumen.cantidad_agua} unds`}
                    color="#3498DB" 
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
            cursor: onClick ? 'pointer' : 'default',
            // Añadimos efecto hover visual si es clickeable
            transform: onClick ? 'scale(1)' : 'none' 
        }}
        // Efecto simple de hover (opcional, requiere CSS real para hover perfecto o styled-components)
        title={onClick ? "Clic para ver detalles" : ""}
    >
        <div style={{ fontSize: '20px', marginBottom: '10px' }}>{icono}</div>
        <h3 style={{ margin: '0 0 10px 0', fontWeight: 'normal', opacity: 0.8 }}>{titulo}</h3>
        <span style={{ fontSize: '32px', fontWeight: 'bold' }}>{valor}</span>
    </div>
);

// Estilos CSS-in-JS
const styles = {
    container: {
        minHeight: '100vh', // Se ajusta al contenido o pantalla
        height: '100%',     // Asegura que llene el contenedor padre
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
    // ❌ ELIMINADO: logoutBtn (Ya no se usa)
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
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