import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

interface Alerta {
    id: number;
    tipo: 'GAS' | 'AGUA';
    nombre: string;
    telefono: string;
    dias: number;
}

const Alertas: React.FC = () => {
    const [alertas, setAlertas] = useState<Alerta[]>([]);
    const [loading, setLoading] = useState(true);

    const cargarAlertas = async () => {
        try {
            const res = await api.get('/alertas');
            setAlertas(res.data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarAlertas();
    }, []);

    const enviarWpp = (alerta: Alerta) => {
        const prod = alerta.tipo === 'GAS' ? "tu gas" : "tu agua";
        const msg = `Hola ${alerta.nombre}, vimos que ${prod} está por acabarse. ¿Deseas pedir uno?`;
        // Formato de número internacional (Asumiendo Ecuador 593)
        let tel = alerta.telefono.trim();
        if (tel.startsWith('0')) tel = '593' + tel.substring(1);

        window.open(`https://wa.me/${tel}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    const omitirAlerta = async (alerta: Alerta) => {
        if (!window.confirm(`¿Omitir alerta de ${alerta.nombre}? Se reiniciará el contador.`)) return;

        try {
            await api.post(`/alertas/${alerta.id}/reset`, { tipo: alerta.tipo });
            // Recargamos la lista localmente
            setAlertas(alertas.filter(a => !(a.id === alerta.id && a.tipo === alerta.tipo)));
        } catch (error) {
            alert("Error al actualizar");
        }
    };

    // Separamos en dos listas
    const gasAlerts = alertas.filter(a => a.tipo === 'GAS');
    const aguaAlerts = alertas.filter(a => a.tipo === 'AGUA');

    if (loading) return <div style={{ color: 'white', padding: 20 }}>Cargando alertas...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={{ margin: 0 }}>Centro de Alertas</h2>
                <button onClick={cargarAlertas} style={styles.btnReload}>↻ Actualizar</button>
            </div>

            <div style={styles.columnsContainer}>

                {/* --- COLUMNA GAS --- */}
                <div style={styles.column}>
                    <h3 style={{ ...styles.colTitle, color: '#E67E22' }}>🔥 GAS (Por vencer)</h3>
                    <div style={styles.list}>
                        {gasAlerts.length === 0 && <p style={styles.emptyMsg}>Todo en orden 👍</p>}
                        {gasAlerts.map((a, i) => (
                            <CardAlerta key={i} data={a} onWpp={() => enviarWpp(a)} onOmitir={() => omitirAlerta(a)} />
                        ))}
                    </div>
                </div>

                {/* --- COLUMNA AGUA --- */}
                <div style={styles.column}>
                    <h3 style={{ ...styles.colTitle, color: '#3498DB' }}>💧 AGUA (Por vencer)</h3>
                    <div style={styles.list}>
                        {aguaAlerts.length === 0 && <p style={styles.emptyMsg}>Todo en orden 👍</p>}
                        {aguaAlerts.map((a, i) => (
                            <CardAlerta key={i} data={a} onWpp={() => enviarWpp(a)} onOmitir={() => omitirAlerta(a)} />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

// Componente Tarjeta Individual
const CardAlerta = ({ data, onWpp, onOmitir }: { data: Alerta, onWpp: () => void, onOmitir: () => void }) => {
    const esVencido = data.dias <= 0;
    const colorDias = esVencido ? '#ff4444' : '#ffbb00';
    const textoDias = esVencido ? "¡VENCIDO!" : `${data.dias} días restan`;

    return (
        <div style={styles.card}>
            <div style={styles.cardInfo}>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: colorDias }}>
                    ⬤ {data.nombre}
                </div>
                <div style={{ fontSize: '13px', color: '#aaa', marginTop: '4px' }}>
                    📞 {data.telefono} | {textoDias}
                </div>
            </div>
            <div style={styles.cardActions}>
                <button onClick={onWpp} style={{ ...styles.btnAction, backgroundColor: '#25D366' }}>Wpp</button>
                <button onClick={onOmitir} style={{ ...styles.btnAction, backgroundColor: '#444' }}>Omitir</button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        color: 'white',
        height: '100%',
        boxSizing: 'border-box' as const
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        borderBottom: '1px solid #444',
        paddingBottom: '10px'
    },
    btnReload: {
        backgroundColor: '#005580',
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    columnsContainer: {
        display: 'flex',
        gap: '20px',
        height: 'calc(100vh - 150px)', // Ajuste para que no se salga de pantalla
    },
    column: {
        flex: 1,
        backgroundColor: '#252525',
        borderRadius: '10px',
        padding: '15px',
        display: 'flex',
        flexDirection: 'column' as const
    },
    colTitle: {
        textAlign: 'center' as const,
        borderBottom: '1px solid #444',
        paddingBottom: '10px',
        margin: '0 0 10px 0'
    },
    list: {
        flex: 1,
        overflowY: 'auto' as const
    },
    emptyMsg: {
        textAlign: 'center' as const,
        color: 'gray',
        marginTop: '20px'
    },
    card: {
        backgroundColor: '#333',
        borderRadius: '8px',
        padding: '10px',
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid #444'
    },
    cardInfo: {
        flex: 1
    },
    cardActions: {
        display: 'flex',
        gap: '5px'
    },
    btnAction: {
        border: 'none',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '12px'
    }
};

export default Alertas;