import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const Historial: React.FC = () => {
    // ... (Tu lógica de estado se mantiene igual, copiamos lo esencial)
    const [ventas, setVentas] = useState<any[]>([]);
    const [filtros, setFiltros] = useState({ desde: new Date().toISOString().slice(0, 10), hasta: new Date().toISOString().slice(0, 10), cliente: '' });
    const [loading, setLoading] = useState(false);

    const cargarHistorial = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams(filtros);
            const res = await api.get(`/ventas?${params}`);
            setVentas(res.data.data);
        } catch (e) { } finally { setLoading(false); }
    };

    useEffect(() => { cargarHistorial(); }, []);

    const anular = async (id: number) => {
        if (window.confirm("¿Anular?")) { await api.delete(`/ventas/${id}`); cargarHistorial(); }
    };

    return (
        <div style={styles.container}>
            <h2 style={{ marginTop: 0 }}>Historial</h2>

            {/* Filtros apilables */}
            <div style={styles.filterBar}>
                <input type="date" value={filtros.desde} onChange={e => setFiltros({ ...filtros, desde: e.target.value })} style={styles.input} />
                <input type="date" value={filtros.hasta} onChange={e => setFiltros({ ...filtros, hasta: e.target.value })} style={styles.input} />
                <button onClick={cargarHistorial} style={styles.btnBuscar}>Buscar</button>
            </div>

            {/* TABLA CON SCROLL HORIZONTAL */}
            <div style={styles.tableResponsive}>
                <table style={styles.table}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #555', textAlign: 'left' }}>
                            <th style={styles.th}>Fecha</th>
                            <th style={styles.th}>Cliente</th>
                            <th style={styles.th}>Detalle</th>
                            <th style={styles.th}>Total</th>
                            <th style={styles.th}>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventas.map((v) => (
                            <tr key={v.id} style={{ borderBottom: '1px solid #333' }}>
                                <td style={styles.td}>{new Date(v.fecha_venta).toLocaleDateString()}</td>
                                <td style={styles.td}>{v.cliente?.nombre || 'Consumidor'}</td>
                                <td style={styles.td}><small style={{ color: '#aaa' }}>{v.detalles?.length} prods</small></td>
                                <td style={{ ...styles.td, color: '#2ecc71' }}>${v.total}</td>
                                <td style={styles.td}><button onClick={() => anular(v.id)} style={styles.btnAnular}>Anular</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '20px', color: 'white', height: '100%', display: 'flex', flexDirection: 'column' as const, boxSizing: 'border-box' as const },
    filterBar: { display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' as const },
    input: { padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#333', color: 'white' },
    btnBuscar: { padding: '10px 20px', backgroundColor: '#3498DB', color: 'white', border: 'none', borderRadius: '5px' },

    // LA CLAVE DE LA RESPONSIVIDAD EN TABLAS:
    tableResponsive: { flex: 1, overflowX: 'auto' as const, backgroundColor: '#222', borderRadius: '8px' },

    table: { width: '100%', borderCollapse: 'collapse' as const, minWidth: '500px' }, // minWidth fuerza el scroll en pantallas pequeñas
    th: { padding: '12px', color: '#aaa', fontSize: '14px' },
    td: { padding: '12px' },
    btnAnular: { backgroundColor: '#c0392b', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }
};

export default Historial;