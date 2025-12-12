import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

interface Producto { id: number; nombre: string; precio: string; }
interface Cliente { id: number; nombre: string; telefono: string; categoria: string; }
interface ItemCarrito { producto: Producto; cantidad: number; subtotal: number; }

const Ventas: React.FC = () => {
    const [busqueda, setBusqueda] = useState('');
    const [resultados, setResultados] = useState<Cliente[]>([]);
    const [clienteSel, setClienteSel] = useState<Cliente | null>(null);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
    const [total, setTotal] = useState(0);

    // --- RESPONSIVE LOGIC ---
    const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 900);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        api.get('/productos').then(res => setProductos(res.data));
    }, []);

    const ejecutarBusqueda = async () => {
        if (busqueda.length > 1) {
            try {
                const res = await api.get(`/clientes/buscar?q=${busqueda}`);
                setResultados(res.data);
            } catch (e) { console.error(e); }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') ejecutarBusqueda();
    };

    const seleccionarCliente = (c: Cliente) => {
        setClienteSel(c);
        setBusqueda('');
        setResultados([]);
    };

    const getEstiloProducto = (prod: Producto) => {
        const nombre = prod.nombre.toLowerCase();
        const categoriaCliente = clienteSel?.categoria || 'Hogar';

        const esProductoNegocio = nombre.includes('negocio');
        if (categoriaCliente === 'Hogar' && esProductoNegocio) return null;
        if (categoriaCliente === 'Negocio' && !esProductoNegocio) return null;

        let style = { backgroundColor: '#005580', color: 'white', border: 'none' };

        if (esProductoNegocio) {
            style.backgroundColor = '#6C3483';
            if (nombre.includes('amarillo')) style.color = '#F1C40F';
            else if (nombre.includes('naranja')) style.color = '#E67E22';
        } else {
            if (nombre.includes('naranja')) style.backgroundColor = '#E67E22';
            else if (nombre.includes('amarillo')) { style.backgroundColor = '#F1C40F'; style.color = 'black'; }
            else if (nombre.includes('agua')) style.backgroundColor = '#3498DB';
        }
        return style;
    };

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

            {/* --- PANEL PRODUCTOS (Arriba en móvil, Izquierda en PC) --- */}
            <div style={{
                ...styles.leftPanel,
                flex: isMobile ? 'none' : 3,
                borderRight: isMobile ? 'none' : '1px solid #333',
                borderBottom: isMobile ? '1px solid #333' : 'none',
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
                                👤 {c.nombre} <small>({c.categoria})</small>
                            </div>
                        ))}
                    </div>
                )}

                <div style={styles.infoCliente}>
                    {clienteSel ? (
                        <>
                            <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>✅ {clienteSel.nombre}</span>
                            <button onClick={() => setClienteSel(null)} style={styles.btnCancelSmall}>✕</button>
                        </>
                    ) : <span style={{ color: 'gray' }}>Seleccione Cliente</span>}
                </div>

                <h2 style={{ ...styles.title, marginTop: '20px' }}>2. Productos</h2>
                <div style={styles.grid}>
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

            {/* --- PANEL CARRITO (Abajo en móvil, Derecha en PC) --- */}
            <div style={{
                ...styles.rightPanel,
                flex: isMobile ? 'none' : 1,
                minHeight: isMobile ? '300px' : 'auto'
            }}>
                <h2 style={styles.title}>3. Resumen</h2>

                <div style={styles.carritoList}>
                    {carrito.length === 0 && <p style={{ textAlign: 'center', color: 'gray' }}>Vacío</p>}
                    {carrito.map((item, i) => (
                        <div key={i} style={styles.carritoItem}>
                            <div>1 x {item.producto.nombre}</div>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>${item.subtotal.toFixed(2)}</span>
                                <button onClick={() => eliminarItem(i)} style={styles.btnDelete}>X</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={styles.footer}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '15px', color: '#2ecc71' }}>
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

const styles = {
    container: {
        display: 'flex',
        height: '100%', // Se adapta al contenedor padre (Layout)
        backgroundColor: '#1a1a1a',
        color: 'white',
        fontFamily: 'Segoe UI, sans-serif'
    } as React.CSSProperties,
    leftPanel: { padding: '20px' } as React.CSSProperties,
    rightPanel: {
        backgroundColor: '#252525',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column' as const
    } as React.CSSProperties,
    title: {
        margin: '0 0 15px 0',
        borderBottom: '2px solid #444',
        paddingBottom: '5px',
        fontSize: '20px'
    } as React.CSSProperties,
    searchRow: { display: 'flex', gap: '10px', marginBottom: '10px' } as React.CSSProperties,
    input: {
        flex: 1, padding: '12px', fontSize: '16px', backgroundColor: '#333',
        border: '1px solid #555', color: 'white', borderRadius: '5px'
    } as React.CSSProperties,
    btnBuscar: {
        padding: '0 15px', backgroundColor: '#444', color: 'white',
        border: '1px solid #555', borderRadius: '5px', cursor: 'pointer'
    } as React.CSSProperties,
    resultsList: {
        backgroundColor: '#333', borderRadius: '5px', marginBottom: '15px', border: '1px solid #555'
    } as React.CSSProperties,
    resultItem: {
        padding: '10px', borderBottom: '1px solid #444', cursor: 'pointer'
    } as React.CSSProperties,
    infoCliente: {
        marginBottom: '20px', padding: '10px', backgroundColor: '#222',
        borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    } as React.CSSProperties,
    btnCancelSmall: {
        background: 'none', border: 'none', color: '#aaa', fontSize: '18px', cursor: 'pointer'
    } as React.CSSProperties,
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', // Ajustado para móviles
        gap: '10px'
    } as React.CSSProperties,
    prodCard: {
        height: '90px', borderRadius: '10px', display: 'flex', flexDirection: 'column' as const,
        justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
    } as React.CSSProperties,
    carritoList: { flex: 1, overflowY: 'auto' as const, marginBottom: '20px' } as React.CSSProperties,
    carritoItem: {
        backgroundColor: '#333', padding: '12px', borderRadius: '5px', marginBottom: '8px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    } as React.CSSProperties,
    btnDelete: {
        backgroundColor: '#c0392b', color: 'white', border: 'none', borderRadius: '4px',
        padding: '5px 10px', cursor: 'pointer'
    } as React.CSSProperties,
    footer: {
        borderTop: '2px solid #444', paddingTop: '20px', textAlign: 'center' as const
    } as React.CSSProperties,
    btnCancel: {
        flex: 1, padding: '15px', backgroundColor: '#c0392b', color: 'white', border: 'none',
        borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
    } as React.CSSProperties,
    btnCobrar: {
        flex: 3, padding: '15px', backgroundColor: '#27ae60', color: 'white', border: 'none',
        borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px'
    } as React.CSSProperties
};

export default Ventas;