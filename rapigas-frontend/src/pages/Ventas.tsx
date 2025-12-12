import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

// Tipos de datos
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

    // Cargar productos al iniciar
    useEffect(() => {
        api.get('/productos').then(res => setProductos(res.data));
    }, []);

    // Buscar clientes
    const buscarCliente = async (texto: string) => {
        setBusqueda(texto);
        if (texto.length > 2) {
            const res = await api.get(`/clientes/buscar?q=${texto}`);
            setResultados(res.data);
        } else {
            setResultados([]);
        }
    };

    // Seleccionar cliente y limpiar búsqueda
    const seleccionarCliente = (c: Cliente) => {
        setClienteSel(c);
        setBusqueda('');
        setResultados([]);
    };

    // Lógica inteligente de colores y filtros (Igual que en tu Python)
    const getEstiloProducto = (prod: Producto) => {
        const nombre = prod.nombre.toLowerCase();
        // Lógica de visualización
        if (clienteSel?.categoria === 'Hogar' && nombre.includes('negocio')) return null; // Ocultar
        if (clienteSel?.categoria === 'Negocio' && !nombre.includes('negocio')) return null; // Ocultar

        // Colores originales
        let bgColor = '#005580'; // Azul estándar
        let textColor = 'white';

        if (nombre.includes('negocio')) {
            bgColor = '#6C3483'; // Morado
            if (nombre.includes('amarillo')) textColor = '#F1C40F';
            else if (nombre.includes('naranja')) textColor = '#E67E22';
        } else {
            if (nombre.includes('naranja')) bgColor = '#E67E22'; // Cilindro Naranja
            else if (nombre.includes('amarillo')) { bgColor = '#F1C40F'; textColor = 'black'; } // Válvula
            else if (nombre.includes('agua')) bgColor = '#3498DB'; // Agua
        }

        return { backgroundColor: bgColor, color: textColor };
    };

    const agregarAlCarrito = (prod: Producto) => {
        const nuevoItem = {
            producto: prod,
            cantidad: 1,
            subtotal: parseFloat(prod.precio)
        };
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
        } catch (e) {
            alert("❌ Error al registrar la venta");
        }
    };

    return (
        <div style={styles.container}>
            {/* PANEL IZQUIERDO (Buscador y Productos) */}
            <div style={styles.leftPanel}>
                <h2 style={styles.title}>1. ¿Quién compra?</h2>

                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Buscar nombre o celular (09...)"
                        value={busqueda}
                        onChange={e => buscarCliente(e.target.value)}
                        style={styles.input}
                    />
                    {/* Lista flotante de resultados */}
                    {resultados.length > 0 && (
                        <div style={styles.dropdown}>
                            {resultados.map(c => (
                                <div key={c.id} onClick={() => seleccionarCliente(c)} style={styles.dropdownItem}>
                                    👤 {c.nombre} | 📞 {c.telefono} | 🏠 {c.categoria || 'Hogar'}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info del Cliente Seleccionado */}
                <div style={styles.infoCliente}>
                    {clienteSel ? (
                        <span style={{ color: '#2ecc71', fontWeight: 'bold', fontSize: '18px' }}>
                            ✅ {clienteSel.nombre} ({clienteSel.categoria || 'Hogar'})
                        </span>
                    ) : (
                        <span style={{ color: 'gray' }}>Ningún cliente seleccionado (Precios: Hogar)</span>
                    )}
                    {clienteSel && (
                        <button onClick={() => setClienteSel(null)} style={styles.btnCancelSmall}>✕</button>
                    )}
                </div>

                <h2 style={{ ...styles.title, marginTop: '20px' }}>2. ¿Qué lleva?</h2>
                <div style={styles.grid}>
                    {productos.map(p => {
                        const estilo = getEstiloProducto(p);
                        if (!estilo) return null; // Si no corresponde a la categoría, no se muestra

                        return (
                            <button
                                key={p.id}
                                onClick={() => agregarAlCarrito(p)}
                                style={{ ...styles.prodCard, ...estilo }}
                            >
                                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{p.nombre}</span>
                                <span style={{ fontSize: '14px', opacity: 0.9 }}>${parseFloat(p.precio).toFixed(2)}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* PANEL DERECHO (Carrito) */}
            <div style={styles.rightPanel}>
                <h2 style={styles.title}>Resumen</h2>
                <div style={styles.carritoList}>
                    {carrito.map((item, i) => (
                        <div key={i} style={styles.carritoItem}>
                            <span>1 x {item.producto.nombre}</span>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '10px', fontWeight: 'bold' }}>${item.subtotal.toFixed(2)}</span>
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
                        <button
                            onClick={() => { setCarrito([]); setClienteSel(null); }}
                            style={styles.btnCancel}
                        >
                            🗑️ Cancelar
                        </button>
                        <button
                            onClick={cobrar}
                            disabled={!clienteSel || carrito.length === 0}
                            style={{
                                ...styles.btnCobrar,
                                opacity: (!clienteSel || carrito.length === 0) ? 0.5 : 1
                            }}
                        >
                            ✅ Cobrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Estilos CSS-in-JS (Modo Oscuro Rapigas)
const styles = {
    container: {
        display: 'flex',
        height: '100vh',
        backgroundColor: '#1a1a1a',
        color: 'white',
        fontFamily: 'Segoe UI, sans-serif'
    } as React.CSSProperties,
    leftPanel: {
        flex: 3, // 75% del ancho
        padding: '20px',
        borderRight: '1px solid #333'
    } as React.CSSProperties,
    rightPanel: {
        flex: 1, // 25% del ancho
        backgroundColor: '#252525', // Ligeramente más claro
        padding: '20px',
        display: 'flex',
        flexDirection: 'column'
    } as React.CSSProperties,
    title: {
        margin: '0 0 15px 0',
        borderBottom: '2px solid #444',
        paddingBottom: '5px'
    } as React.CSSProperties,
    input: {
        width: '100%',
        padding: '12px',
        fontSize: '16px',
        backgroundColor: '#333',
        border: '1px solid #555',
        color: 'white',
        borderRadius: '5px',
        boxSizing: 'border-box' as const
    } as React.CSSProperties,
    dropdown: {
        position: 'absolute' as const,
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#444',
        border: '1px solid #555',
        borderRadius: '0 0 5px 5px',
        zIndex: 10,
        maxHeight: '200px',
        overflowY: 'auto' as const
    } as React.CSSProperties,
    dropdownItem: {
        padding: '10px',
        cursor: 'pointer',
        borderBottom: '1px solid #555'
    } as React.CSSProperties,
    infoCliente: {
        margin: '15px 0',
        padding: '10px',
        backgroundColor: '#222',
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    } as React.CSSProperties,
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '15px'
    } as React.CSSProperties,
    prodCard: {
        height: '100px',
        borderRadius: '10px',
        border: 'none',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        transition: 'transform 0.1s'
    } as React.CSSProperties,
    carritoList: {
        flex: 1,
        overflowY: 'auto' as const,
        marginBottom: '20px'
    } as React.CSSProperties,
    carritoItem: {
        backgroundColor: '#333',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    } as React.CSSProperties,
    footer: {
        borderTop: '2px solid #444',
        paddingTop: '20px',
        textAlign: 'center' as const
    } as React.CSSProperties,
    btnDelete: {
        backgroundColor: '#c0392b',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '2px 8px',
        cursor: 'pointer',
        marginLeft: '10px'
    } as React.CSSProperties,
    btnCancelSmall: {
        background: 'none',
        border: 'none',
        color: '#aaa',
        fontSize: '20px',
        cursor: 'pointer'
    } as React.CSSProperties,
    btnCancel: {
        flex: 1,
        padding: '15px',
        backgroundColor: '#c0392b',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '16px'
    } as React.CSSProperties,
    btnCobrar: {
        flex: 2,
        padding: '15px',
        backgroundColor: '#27ae60',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '18px'
    } as React.CSSProperties
};

export default Ventas;