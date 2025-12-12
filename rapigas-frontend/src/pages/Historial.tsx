import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const Historial: React.FC = () => {
    const [ventas, setVentas] = useState<any[]>([]);
    const [filtros, setFiltros] = useState({
        desde: new Date().toISOString().slice(0, 10), // Hoy por defecto
        hasta: new Date().toISOString().slice(0, 10),
        cliente: ''
    });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const cargarHistorial = async (p = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: p.toString(),
                desde: filtros.desde,
                hasta: filtros.hasta,
                cliente: filtros.cliente
            });

            const res = await api.get(`/ventas?${params}`);
            setVentas(res.data.data);
            setTotalPages(res.data.last_page);
            setPage(p);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Cargar al inicio y cuando cambian filtros importantes
    useEffect(() => {
        cargarHistorial(1);
    }, []); // Carga inicial

    const handleFilterChange = (e: any) => {
        setFiltros({ ...filtros, [e.target.name]: e.target.value });
    };

    const anularVenta = async (id: number) => {
        if (!window.confirm("¿Seguro que deseas anular esta venta?")) return;
        try {
            await api.delete(`/ventas/${id}`);
            cargarHistorial(page); // Recargar
        } catch (e) {
            alert("Error al anular");
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={{ marginTop: 0 }}>Historial de Ventas</h2>

            {/* --- BARRA DE FILTROS --- */}
            <div style={styles.filterBar}>
                <div style={styles.filterGroup}>
                    <label>Desde:</label>
                    <input type="date" name="desde" value={filtros.desde} onChange={handleFilterChange} style={styles.input} />
                </div>
                <div style={styles.filterGroup}>
                    <label>Hasta:</label>
                    <input type="date" name="hasta" value={filtros.hasta} onChange={handleFilterChange} style={styles.input} />
                </div>
                <div style={styles.filterGroup}>
                    <label>Cliente:</label>
                    <input type="text" name="cliente" placeholder="Nombre..." value={filtros.cliente} onChange={handleFilterChange} style={styles.input} />
                </div>
                <button onClick={() => cargarHistorial(1)} style={styles.btnBuscar}>🔍 Buscar</button>
            </div>

            {/* --- TABLA DE RESULTADOS --- */}
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #555' }}>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Fecha</th>
                            <th style={styles.th}>Cliente</th>
                            <th style={styles.th}>Total</th>
                            <th style={styles.th}>Detalles</th>
                            <th style={styles.th}>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan={6} style={{ padding: 20, textAlign: 'center' }}>Cargando...</td></tr> :
                            ventas.map((v) => (
                                <tr key={v.id} style={styles.tr}>
                                    <td style={styles.td}>#{v.id}</td>
                                    <td style={styles.td}>{new Date(v.fecha_venta).toLocaleString()}</td>
                                    <td style={styles.td}>{v.cliente ? v.cliente.nombre : 'Consumidor Final'}</td>
                                    <td style={{ ...styles.td, color: '#2ecc71', fontWeight: 'bold' }}>${parseFloat(v.total).toFixed(2)}</td>
                                    <td style={styles.td}>
                                        <small style={{ color: '#aaa' }}>
                                            {v.detalles.map((d: any) => `${d.cantidad} ${d.producto?.nombre}`).join(', ')}
                                        </small>
                                    </td>
                                    <td style={styles.td}>
                                        <button onClick={() => anularVenta(v.id)} style={styles.btnAnular}>Anular</button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* --- PAGINACIÓN --- */}
            <div style={styles.pagination}>
                <button disabled={page <= 1} onClick={() => cargarHistorial(page - 1)} style={styles.btnPage}>{'<'}</button>
                <span style={{ margin: '0 10px' }}>Página {page} de {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => cargarHistorial(page + 1)} style={styles.btnPage}>{'>'}</button>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '30px', color: 'white', height: '100vh', display: 'flex', flexDirection: 'column' as const },
    filterBar: {
        backgroundColor: '#252525', padding: '15px', borderRadius: '8px', marginBottom: '20px',
        display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' as const
    },
    filterGroup: { display: 'flex', flexDirection: 'column' as const, gap: '5px' },
    input: {
        padding: '8px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#333', color: 'white'
    },
    btnBuscar: {
        padding: '8px 20px', backgroundColor: '#3498DB', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
    },
    tableContainer: {
        flex: 1, overflowY: 'auto' as const, backgroundColor: '#222', borderRadius: '8px', padding: '10px'
    },
    table: { width: '100%', borderCollapse: 'collapse' as const },
    th: { padding: '10px', borderBottom: '1px solid #444', color: '#aaa' },
    tr: { borderBottom: '1px solid #333' },
    td: { padding: '12px 10px' },
    btnAnular: {
        backgroundColor: '#c0392b', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'
    },
    pagination: {
        marginTop: '15px', textAlign: 'center' as const, display: 'flex', justifyContent: 'center', alignItems: 'center'
    },
    btnPage: {
        backgroundColor: '#444', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer'
    }
};

export default Historial;