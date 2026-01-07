import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { useResponsive } from '../hooks/useResponsive';

interface Producto {
    id?: number;
    nombre: string;
    precio: number | string;
}

const Productos: React.FC = () => {
    const { isMobile } = useResponsive();
    const [productos, setProductos] = useState<Producto[]>([]);
    const [form, setForm] = useState<Producto>({ nombre: '', precio: '' });
    const [idEdicion, setIdEdicion] = useState<number | null>(null);

    // Cargar productos
    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            const res = await api.get('/productos');
            setProductos(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const guardar = async () => {
        if (!form.nombre.trim() || !form.precio) {
            toast.error('Complete todos los campos');
            return;
        }

        try {
            if (idEdicion) {
                // Editar
                await api.put(`/productos/${idEdicion}`, form);
                toast.success('Producto actualizado');
            } else {
                // Crear
                await api.post('/productos', form);
                toast.success('Producto creado');
            }
            limpiar();
            cargarProductos();
        } catch (error) {
            toast.error('Error al guardar');
        }
    };

    const eliminar = async (id: number) => {
        if (!window.confirm('¿Seguro de eliminar este producto?')) return;
        try {
            await api.delete(`/productos/${id}`);
            toast.success('Producto eliminado');
            cargarProductos();
        } catch (error) {
            toast.error('No se puede eliminar (probablemente tiene ventas asociadas)');
        }
    };

    const cargarParaEditar = (p: Producto) => {
        setForm({ nombre: p.nombre, precio: p.precio });
        setIdEdicion(p.id || null);
        toast('Editando producto...', { icon: '✏️' });
    };

    const limpiar = () => {
        setForm({ nombre: '', precio: '' });
        setIdEdicion(null);
    };

    return (
        <div style={styles.container}>
            <h2 style={{ marginTop: 0 }}>Inventario de Productos</h2>

            {/* FORMULARIO */}
            <div style={styles.formPanel}>
                <div style={{ display: 'flex', gap: '10px', flexDirection: isMobile ? 'column' : 'row' }}>
                    <input
                        name="nombre"
                        placeholder="Nombre del Producto (Ej: Gas Doméstico)"
                        value={form.nombre}
                        onChange={handleChange}
                        style={{ ...styles.input, flex: 2 }}
                    />
                    <input
                        name="precio"
                        type="number"
                        placeholder="Precio ($)"
                        value={form.precio}
                        onChange={handleChange}
                        style={{ ...styles.input, flex: 1 }}
                    />
                    <button onClick={guardar} style={{ ...styles.btn, backgroundColor: idEdicion ? '#E67E22' : '#2ecc71', flex: 1 }}>
                        {idEdicion ? 'Actualizar' : 'Guardar'}
                    </button>
                    {idEdicion && (
                        <button onClick={limpiar} style={{ ...styles.btn, backgroundColor: '#555', flex: 0.5 }}>
                            Cancelar
                        </button>
                    )}
                </div>
            </div>

            {/* LISTA DE PRODUCTOS */}
            <div style={styles.grid}>
                {productos.map(p => (
                    <div key={p.id} style={styles.card}>
                        <div style={{ flex: 1 }}>
                            <div style={styles.prodName}>{p.nombre}</div>
                            <div style={styles.prodPrice}>$ {Number(p.precio).toFixed(2)}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => cargarParaEditar(p)} style={styles.actionBtn}>✏️</button>
                            <button onClick={() => p.id && eliminar(p.id)} style={{ ...styles.actionBtn, backgroundColor: '#c0392b' }}>🗑️</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '20px', color: 'white', height: '100%', boxSizing: 'border-box' as const },
    formPanel: { backgroundColor: '#252525', padding: '15px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #333' },
    input: { padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#333', color: 'white', fontSize: '16px' },
    btn: { padding: '12px', border: 'none', borderRadius: '5px', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '15px' },
    card: { backgroundColor: '#333', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #3498DB' },
    prodName: { fontWeight: 'bold', fontSize: '16px', marginBottom: '5px' },
    prodPrice: { color: '#2ecc71', fontWeight: 'bold', fontSize: '18px' },
    actionBtn: { padding: '8px 12px', border: 'none', borderRadius: '5px', cursor: 'pointer', backgroundColor: '#444', color: 'white' }
};

export default Productos;