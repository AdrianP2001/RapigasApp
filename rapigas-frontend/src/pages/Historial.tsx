import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const Historial: React.FC = () => {
    // 1. Estados completos
    const [ventas, setVentas] = useState<any[]>([]);
    const [filtros, setFiltros] = useState({
        desde: new Date().toISOString().slice(0, 10),
        hasta: new Date().toISOString().slice(0, 10),
        cliente: ''
    });
    // Aquí definimos 'page', que es lo que te daba error antes
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    // 2. Función de carga que ACEPTA el argumento 'p' (página)
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
            setPage(p); // Actualizamos la página actual en el estado
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarHistorial(1);
    }, []);

    const handleFilterChange = (e: any) => {
        setFiltros({ ...filtros, [e.target.name]: e.target.value });
    };

    // 3. Función Anular corregida
    const anularVenta = async (id: number) => {
        // 1. Pedir contraseña (igual que en Python)
        const password = prompt("🔒 SEGURIDAD\nPara anular esta venta, ingrese su contraseña de administrador:");

        if (!password) return; // Si cancela o lo deja vacío, no hace nada

        try {
            // 2. Enviar la contraseña en el cuerpo de la petición DELETE
            // Nota: En axios DELETE, el body se pasa dentro de la propiedad 'data'
            await api.delete(`/ventas/${id}`, {
                data: { password: password }
            });

            alert("✅ Venta anulada correctamente");
            cargarHistorial(page); // Recargar la tabla

        } catch (error: any) {
            // 3. Manejar errores específicos
            if (error.response && error.response.status === 403) {
                alert("⛔ CONTRASEÑA INCORRECTA. No se anuló la venta.");
            } else {
                alert("❌ Ocurrió un error al intentar anular.");
            }
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={{ marginTop: 0 }}>Historial de Ventas</h2>

            {/* Filtros */}
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

            {/* Tabla Responsive (Con Scroll Horizontal) */}
            <div style={styles.tableResponsive}>
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

            {/* Paginación */}
            <div style={styles.pagination}>
                <button disabled={page <= 1} onClick={() => cargarHistorial(page - 1)} style={styles.btnPage}>{'<'}</button>
                <span style={{ margin: '0 10px' }}>Página {page} de {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => cargarHistorial(page + 1)} style={styles.btnPage}>{'>'}</button>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '20px', color: 'white', height: '100%', display: 'flex', flexDirection: 'column' as const, boxSizing: 'border-box' as const },
    filterBar: {
        backgroundColor: '#252525', padding: '15px', borderRadius: '8px', marginBottom: '20px',
        display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' as const
    },
    filterGroup: { display: 'flex', flexDirection: 'column' as const, gap: '5px' },
    input: {
        padding: '8px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#333', color: 'white'
    },
    btnBuscar: {
        padding: '8px 20px', backgroundColor: '#3498DB', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
    },
    // Contenedor que permite scroll horizontal en móviles
    tableResponsive: {
        flex: 1, overflowX: 'auto' as const, backgroundColor: '#222', borderRadius: '8px', padding: '10px'
    },
    table: { width: '100%', borderCollapse: 'collapse' as const, minWidth: '600px' }, // minWidth fuerza el scroll
    th: { padding: '10px', borderBottom: '1px solid #444', color: '#aaa', whiteSpace: 'nowrap' as const },
    tr: { borderBottom: '1px solid #333' },
    td: { padding: '12px 10px', whiteSpace: 'nowrap' as const },
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