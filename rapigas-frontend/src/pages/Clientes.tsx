import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

// Interfaz de datos
interface Cliente {
    id?: number;
    nombre: string;
    telefono: string;
    direccion: string;
    categoria: string;
    frecuencia_consumo: number; // Gas
    frecuencia_agua: number;    // Agua
}

const Clientes: React.FC = () => {
    // Estado del Formulario
    const [form, setForm] = useState<Cliente>({
        nombre: '', telefono: '', direccion: '', categoria: 'Hogar',
        frecuencia_consumo: 20, frecuencia_agua: 7
    });
    const [idEdicion, setIdEdicion] = useState<number | null>(null);

    // Estado de la Lista
    const [lista, setLista] = useState<Cliente[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [mensaje, setMensaje] = useState({ text: '', color: '' });

    // Cargar clientes al inicio
    useEffect(() => {
        cargarClientes();
    }, []);

    const cargarClientes = async (query = '') => {
        try {
            const url = query ? `/clientes/buscar?q=${query}` : '/clientes';
            const res = await api.get(url);
            setLista(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Manejar inputs del formulario
    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // --- ACCIONES ---

    const guardar = async () => {
        if (!form.nombre || !form.telefono) {
            setMensaje({ text: '❌ Faltan datos obligatorios', color: '#ff4444' });
            return;
        }
        if (form.telefono.length !== 10) {
            setMensaje({ text: '❌ El celular debe tener 10 dígitos', color: '#ff4444' });
            return;
        }

        try {
            await api.post('/clientes', { ...form, id: idEdicion });
            setMensaje({ text: idEdicion ? '✅ Cliente Actualizado' : '✅ Cliente Guardado', color: '#2ecc71' });
            limpiarForm();
            cargarClientes(); // Recargar lista
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                setMensaje({ text: '⚠️ Este número ya existe', color: 'orange' });
            } else {
                setMensaje({ text: '❌ Error al guardar', color: '#ff4444' });
            }
        }
    };

    const eliminar = async () => {
        if (!idEdicion) return;
        if (!window.confirm("¿Estás seguro de eliminar este cliente?")) return;

        try {
            await api.delete(`/clientes/${idEdicion}`);
            setMensaje({ text: '🗑️ Cliente eliminado', color: 'gray' });
            limpiarForm();
            cargarClientes();
        } catch (error) {
            setMensaje({ text: '❌ No se puede eliminar (tiene ventas)', color: '#ff4444' });
        }
    };

    const cargarParaEditar = (c: Cliente) => {
        setForm(c);
        setIdEdicion(c.id || null);
        setMensaje({ text: '✏️ Editando cliente...', color: '#E67E22' });
    };

    const limpiarForm = () => {
        setForm({
            nombre: '', telefono: '', direccion: '', categoria: 'Hogar',
            frecuencia_consumo: 20, frecuencia_agua: 7
        });
        setIdEdicion(null);
        setMensaje({ text: '', color: '' });
    };

    const buscar = (e: any) => {
        const txt = e.target.value;
        setBusqueda(txt);
        cargarClientes(txt);
    };

    return (
        <div style={styles.container}>
            <h2 style={{ marginTop: 0, marginBottom: 20 }}>Gestión de Clientes</h2>

            {/* --- FORMULARIO SUPERIOR --- */}
            <div style={styles.formPanel}>
                {/* Fila 1 */}
                <div style={styles.row}>
                    <input name="nombre" placeholder="Nombre Completo" value={form.nombre} onChange={handleChange} style={{ ...styles.input, flex: 2 }} />
                    <input name="telefono" placeholder="Celular (09...)" value={form.telefono} onChange={handleChange} style={{ ...styles.input, flex: 1 }} maxLength={10} />
                    <select name="categoria" value={form.categoria} onChange={handleChange} style={{ ...styles.input, flex: 1 }}>
                        <option value="Hogar">Hogar</option>
                        <option value="Negocio">Negocio</option>
                    </select>
                </div>

                {/* Fila 2 */}
                <div style={styles.row}>
                    <label style={{ color: 'gray' }}>Duración estimada (días):</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <input name="frecuencia_consumo" type="number" value={form.frecuencia_consumo} onChange={handleChange} style={{ ...styles.input, width: 60 }} />
                        <span>Gas</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <input name="frecuencia_agua" type="number" value={form.frecuencia_agua} onChange={handleChange} style={{ ...styles.input, width: 60 }} />
                        <span>Agua</span>
                    </div>
                </div>

                {/* Fila 3 */}
                <div style={styles.row}>
                    <input name="direccion" placeholder="Dirección / Referencia" value={form.direccion} onChange={handleChange} style={{ ...styles.input, flex: 3 }} />

                    <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={guardar} style={{ ...styles.btn, backgroundColor: idEdicion ? '#E67E22' : '#2ecc71' }}>
                            {idEdicion ? 'Actualizar' : 'Guardar Nuevo'}
                        </button>

                        <button onClick={eliminar} disabled={!idEdicion} style={{ ...styles.btn, backgroundColor: '#c0392b', opacity: idEdicion ? 1 : 0.5 }}>
                            Eliminar
                        </button>

                        <button onClick={limpiarForm} style={{ ...styles.btn, backgroundColor: 'gray', width: 40 }}>X</button>
                    </div>
                </div>

                <p style={{ color: mensaje.color, fontWeight: 'bold', marginTop: 10, minHeight: 20 }}>
                    {mensaje.text}
                </p>
            </div>

            {/* --- BUSCADOR --- */}
            <div style={{ marginBottom: 10, display: 'flex', gap: 10 }}>
                <input
                    placeholder="🔍 Buscar por nombre..."
                    value={busqueda}
                    onChange={buscar}
                    style={{ ...styles.input, width: '100%' }}
                />
                <button onClick={() => { setBusqueda(''); cargarClientes(); }} style={{ ...styles.btn, backgroundColor: '#444' }}>
                    Ver Todos
                </button>
            </div>

            {/* --- LISTA --- */}
            <div style={styles.listContainer}>
                {lista.map((c) => (
                    <div key={c.id} style={styles.card} onClick={() => cargarParaEditar(c)}>
                        <div style={{ fontWeight: 'bold', fontSize: 16 }}>{c.nombre}</div>
                        <div style={{ color: '#aaa', fontSize: 14 }}>
                            📞 {c.telefono} | 🏠 {c.categoria} | ⏱️ Gas: {c.frecuencia_consumo}d - Agua: {c.frecuencia_agua}d
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '30px',
        color: 'white',
        height: '100vh',
        boxSizing: 'border-box' as const,
        display: 'flex',
        flexDirection: 'column' as const
    },
    formPanel: {
        backgroundColor: '#252525',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px',
        border: '1px solid #333'
    },
    row: {
        display: 'flex',
        gap: '15px',
        marginBottom: '15px',
        alignItems: 'center'
    },
    input: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #444',
        backgroundColor: '#333',
        color: 'white',
        fontSize: '15px'
    },
    btn: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer'
    },
    listContainer: {
        flex: 1,
        overflowY: 'auto' as const,
        backgroundColor: '#222',
        borderRadius: '10px',
        padding: '10px',
        border: '1px solid #333'
    },
    card: {
        backgroundColor: '#333',
        padding: '12px',
        borderRadius: '5px',
        marginBottom: '8px',
        cursor: 'pointer',
        borderLeft: '4px solid #005580',
        transition: 'background 0.2s',
    }
};

export default Clientes;