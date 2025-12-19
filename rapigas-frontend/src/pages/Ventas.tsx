import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig';
import { useResponsive } from '../hooks/useResponsive';
import { theme } from '../styles/theme';

interface Producto { id: number; nombre: string; precio: string; }
interface Cliente { id: number; nombre: string; telefono: string; categoria: string; }
interface ItemCarrito { producto: Producto; cantidad: number; subtotal: number; }

const Ventas: React.FC = () => {
    // --- ESTADOS ---
    const [busqueda, setBusqueda] = useState('');
    const [resultados, setResultados] = useState<Cliente[]>([]);
    const [clienteSel, setClienteSel] = useState<Cliente | null>(null);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
    const [total, setTotal] = useState(0);

    // --- HOOK RESPONSIVE ---
    const { isMobile, isTablet } = useResponsive();

    const getGridTemplate = () => {
        if (isMobile) return 'repeat(auto-fill, minmax(130px, 1fr))';
        if (isTablet) return 'repeat(auto-fill, minmax(160px, 1fr))';
        return 'repeat(auto-fill, minmax(180px, 1fr))';
    };

    // --- CARGA INICIAL ---
    useEffect(() => {
        api.get('/productos').then(res => setProductos(res.data));
    }, []);

    // --- BÚSQUEDA (Con useCallback para corregir Warning) ---
    const ejecutarBusqueda = useCallback(async () => {
        if (busqueda.length > 1) {
            try {
                const res = await api.get(`/clientes/buscar?q=${busqueda}`);
                setResultados(res.data);
            } catch (e) { console.error(e); }
        }
    }, [busqueda]); // Dependencia correcta

    // Debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (busqueda.length > 1) {
                ejecutarBusqueda();
            } else if (busqueda === '') {
                setResultados([]);
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [busqueda, ejecutarBusqueda]); // Ahora React está feliz con las dependencias

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') ejecutarBusqueda();
    };

    const seleccionarCliente = (c: Cliente) => {
        setClienteSel(c);
        setBusqueda('');
        setResultados([]);
    };

    // --- ESTILOS DINÁMICOS ---
    const getEstiloProducto = (prod: Producto) => {
        const nombre = prod.nombre.toLowerCase();
        const categoriaCliente = clienteSel?.categoria || 'Hogar';
        const esProductoNegocio = nombre.includes('negocio');

        if (categoriaCliente === 'Hogar' && esProductoNegocio) return null;
        if (categoriaCliente === 'Negocio' && !esProductoNegocio) return null;

        let style = {
            backgroundColor: theme.colors.primary,
            color: 'white',
            border: `1px solid ${theme.colors.border}`
        };

        if (esProductoNegocio) {
            style.backgroundColor = '#6C3483';
            if (nombre.includes('amarillo')) style.color = theme.colors.warning;
            else if (nombre.includes('naranja')) style.color = '#E67E22';
        } else {
            if (nombre.includes('naranja')) style.backgroundColor = '#E67E22';
            else if (nombre.includes('amarillo')) {
                style.backgroundColor = theme.colors.warning;
                style.color = 'black';
            }
            else if (nombre.includes('agua')) style.backgroundColor = theme.colors.primary;
        }
        return style;
    };

    // --- LÓGICA CARRITO ---
    const agregarAlCarrito = (prod: Producto) => {
        const nuevoItem = { producto: prod, cantidad: 1, subtotal: parseFloat(prod.precio) };
        const nuevoCarrito = [...carrito, nuevoItem];
        setCarrito(nuevoCarrito);
        calcularTotal(nuevoCarrito);
    };

    const eliminarItem = (index: number) => {
        const nuevoCarrito = carrito.filter((_, i) => i !== index);
        setCarrito(nuevoCarrito);
        calcularTotal(nuevoCarrito);
    };

    const calcularTotal = (items: ItemCarrito[]) => {
        setTotal(items.reduce((acc, item) => acc + item.subtotal, 0));
    };

    const cobrar = async () => {
        if (!clienteSel) return;
        try {
            await api.post('/ventas', {
                cliente_id: clienteSel.id,
                total: total,
                carrito: carrito.map(i => ({
                    id: i.producto.id,
                    nombre: i.producto.nombre,
                    cantidad: i.cantidad,
                    precio: i.producto.precio
                }))
            });
            alert("✅ ¡Venta registrada con éxito!");
            setCarrito([]);
            setClienteSel(null);
            setTotal(0);
        } catch (e) { alert("❌ Error al registrar la venta"); }
    };

    return (
        <div style={{ ...styles.container, flexDirection: isMobile ? 'column' : 'row' }}>
            {/* PANEL IZQUIERDO */}
            <div style={{
                ...styles.leftPanel,
                flex: isMobile ? 'none' : 3,
                borderRight: isMobile ? 'none' : `1px solid ${theme.colors.border}`,
                borderBottom: isMobile ? `1px solid ${theme.colors.border}` : 'none',
                height: isMobile ? 'auto' : '100%',
                overflow: isMobile ? 'visible' : 'auto'
            }}>
                <h2 style={styles.title}>1. Cliente</h2>
                <div style={styles.searchRow}>
                    <input
                        type="text"
                        placeholder="Nombre/Celular..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={styles.input}
                    />
                    <button onClick={ejecutarBusqueda} style={styles.btnBuscar}>🔍</button>
                </div>

                {resultados.length > 0 && (
                    <div style={styles.resultsList}>
                        {resultados.map(c => (
                            <div key={c.id} onClick={() => seleccionarCliente(c)} style={styles.resultItem}>
                                👤 {c.nombre} <small style={{ color: theme.colors.textMuted }}>({c.categoria})</small>
                            </div>
                        ))}
                    </div>
                )}

                <div style={styles.infoCliente}>
                    {clienteSel ? (
                        <>
                            <span style={{ color: theme.colors.secondary, fontWeight: 'bold' }}>✅ {clienteSel.nombre}</span>
                            <button onClick={() => setClienteSel(null)} style={styles.btnCancelSmall}>✕</button>
                        </>
                    ) : <span style={{ color: theme.colors.textMuted }}>Seleccione Cliente</span>}
                </div>

                <h2 style={{ ...styles.title, marginTop: theme.spacing.md }}>2. Productos</h2>
                <div style={{ ...styles.grid, gridTemplateColumns: getGridTemplate() }}>
                    {productos.map(p => {
                        const estilo = getEstiloProducto(p);
                        if (!estilo) return null;
                        return (
                            <button key={p.id} onClick={() => agregarAlCarrito(p)} style={{ ...styles.prodCard, ...estilo }}>
                                <span style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: 5 }}>{p.nombre}</span>
                                <span>${parseFloat(p.precio).toFixed(2)}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* PANEL DERECHO */}
            <div style={{
                ...styles.rightPanel,
                flex: isMobile ? 'none' : 1,
                minHeight: isMobile ? '300px' : 'auto'
            }}>
                <h2 style={styles.title}>3. Resumen</h2>
                <div style={styles.carritoList}>
                    {carrito.length === 0 && <p style={{ textAlign: 'center', color: theme.colors.textMuted }}>Carrito Vacío</p>}
                    {carrito.map((item, i) => (
                        <div key={i} style={styles.carritoItem}>
                            <div>1 x {item.producto.nombre}</div>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                <span style={{ color: theme.colors.secondary, fontWeight: 'bold' }}>${item.subtotal.toFixed(2)}</span>
                                <button onClick={() => eliminarItem(i)} style={styles.btnDelete}>X</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={styles.footer}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '15px', color: theme.colors.secondary }}>
                        Total: ${total.toFixed(2)}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => { setCarrito([]); setClienteSel(null); setTotal(0); }} style={styles.btnCancel}>🗑️ CANCELAR</button>
                        <button
                            onClick={cobrar}
                            disabled={!clienteSel || carrito.length === 0}
                            style={{
                                ...styles.btnCobrar,
                                opacity: (!clienteSel || carrito.length === 0) ? 0.5 : 1
                            }}
                        >
                            ✅ COBRAR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Estilos usando Theme (Sin colores quemados)
const styles = {
    container: {
        display: 'flex', height: '100%',
        backgroundColor: theme.colors.darkBg,
        color: theme.colors.text,
        fontFamily: 'Segoe UI, sans-serif'
    } as React.CSSProperties,
    leftPanel: { padding: theme.spacing.md } as React.CSSProperties,
    rightPanel: {
        backgroundColor: theme.colors.panelBg,
        padding: theme.spacing.md,
        display: 'flex', flexDirection: 'column' as const
    } as React.CSSProperties,
    title: {
        margin: `0 0 ${theme.spacing.sm} 0`,
        borderBottom: `2px solid ${theme.colors.border}`,
        paddingBottom: '5px', fontSize: '20px'
    } as React.CSSProperties,
    searchRow: { display: 'flex', gap: '10px', marginBottom: theme.spacing.sm } as React.CSSProperties,
    input: {
        flex: 1, padding: '12px', fontSize: '16px', backgroundColor: theme.colors.panelBg,
        border: `1px solid ${theme.colors.border}`, color: 'white', borderRadius: theme.borderRadius
    } as React.CSSProperties,
    btnBuscar: {
        padding: '0 15px', backgroundColor: '#444', color: 'white',
        border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius, cursor: 'pointer'
    } as React.CSSProperties,
    resultsList: {
        backgroundColor: theme.colors.panelBg, borderRadius: theme.borderRadius, marginBottom: theme.spacing.sm, border: `1px solid ${theme.colors.border}`
    } as React.CSSProperties,
    resultItem: {
        padding: '10px', borderBottom: `1px solid ${theme.colors.border}`, cursor: 'pointer'
    } as React.CSSProperties,
    infoCliente: {
        marginBottom: theme.spacing.md, padding: '10px', backgroundColor: '#222',
        borderRadius: theme.borderRadius, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    } as React.CSSProperties,
    btnCancelSmall: {
        background: 'none', border: 'none', color: '#aaa', fontSize: '18px', cursor: 'pointer'
    } as React.CSSProperties,
    grid: { display: 'grid', gap: theme.spacing.sm } as React.CSSProperties,
    prodCard: {
        height: '90px', borderRadius: theme.borderRadius, display: 'flex', flexDirection: 'column' as const,
        justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)', transition: 'transform 0.1s'
    } as React.CSSProperties,
    carritoList: { flex: 1, overflowY: 'auto' as const, marginBottom: theme.spacing.md } as React.CSSProperties,
    carritoItem: {
        backgroundColor: '#333', padding: '12px', borderRadius: theme.borderRadius, marginBottom: '8px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderLeft: `4px solid ${theme.colors.primary}`
    } as React.CSSProperties,
    btnDelete: {
        backgroundColor: theme.colors.danger, color: 'white', border: 'none', borderRadius: '4px',
        padding: '5px 10px', cursor: 'pointer'
    } as React.CSSProperties,
    footer: {
        borderTop: `2px solid ${theme.colors.border}`, paddingTop: theme.spacing.md, textAlign: 'center' as const
    } as React.CSSProperties,
    btnCancel: {
        flex: 1, padding: '15px', backgroundColor: theme.colors.danger, color: 'white', border: 'none',
        borderRadius: theme.borderRadius, cursor: 'pointer', fontWeight: 'bold'
    } as React.CSSProperties,
    btnCobrar: {
        flex: 3, padding: '15px', backgroundColor: theme.colors.secondary, color: 'white', border: 'none',
        borderRadius: theme.borderRadius, cursor: 'pointer', fontWeight: 'bold', fontSize: '18px'
    } as React.CSSProperties
};

export default Ventas;