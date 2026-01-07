import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast'; // ✅ Usamos Toast para mensajes modernos

interface Cliente {
    id?: number; nombre: string; telefono: string; direccion: string;
    categoria: string; frecuencia_consumo: number; frecuencia_agua: number;
}

const Clientes: React.FC = () => {
    // --- ESTADO RESPONSIVE ---
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- ESTADOS DEL FORMULARIO ---
    const [form, setForm] = useState<Cliente>({
        nombre: '', telefono: '', direccion: '', categoria: 'Hogar',
        frecuencia_consumo: 20, frecuencia_agua: 7
    });
    const [idEdicion, setIdEdicion] = useState<number | null>(null);
    const [lista, setLista] = useState<Cliente[]>([]);
    const [busqueda, setBusqueda] = useState('');

    // Cargar clientes al inicio
    useEffect(() => { cargarClientes(); }, []);

    const cargarClientes = async (query = '') => {
        try {
            const url = query ? `/clientes/buscar?q=${query}` : '/clientes';
            const res = await api.get(url);
            setLista(res.data);
        } catch (e) { console.error(e); }
    };

    // --- MANEJO DE INPUTS ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Validación solo números para teléfono
        if (name === 'telefono') {
            const soloNumeros = value.replace(/\D/g, '');
            if (soloNumeros.length <= 10) setForm({ ...form, [name]: soloNumeros });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    // --- GUARDAR (Lógica corregida y única) ---
    const guardar = async () => {
        // 1. Validaciones
        if (!form.nombre.trim()) {
            toast.error('El nombre es obligatorio');
            return;
        }
        const telefonoRegex = /^09\d{8}$/;
        if (!telefonoRegex.test(form.telefono)) {
            toast.error('El celular debe tener 10 dígitos (empieza con 09)');
            return;
        }

        try {
            // 2. Guardar o Actualizar
            await api.post('/clientes', { ...form, id: idEdicion });

            // 3. Feedback y limpieza
            toast.success(idEdicion ? 'Cliente actualizado' : 'Cliente registrado');
            limpiarForm();
            cargarClientes();
        } catch (e) {
            toast.error('Error al guardar en base de datos');
        }
    };

    // --- ELIMINAR ---
    const eliminar = async () => {
        if (!idEdicion || !window.confirm("¿Estás seguro de eliminar este cliente?")) return;
        try {
            await api.delete(`/clientes/${idEdicion}`);
            toast.success('Cliente eliminado');
            limpiarForm();
            cargarClientes();
        } catch {
            toast.error('No se puede eliminar (Tiene historial de ventas)');
        }
    };

    const limpiarForm = () => {
        setForm({ nombre: '', telefono: '', direccion: '', categoria: 'Hogar', frecuencia_consumo: 20, frecuencia_agua: 7 });
        setIdEdicion(null);
    };

    const cargarParaEditar = (c: Cliente) => {
        // Formatear teléfono visualmente (si viene con 593)
        let tel = c.telefono ? c.telefono.toString() : '';
        if (tel.startsWith('593')) tel = '0' + tel.substring(3);

        setForm({
            ...c,
            telefono: tel,
            direccion: c.direccion || '',
            frecuencia_consumo: c.frecuencia_consumo || 20,
            frecuencia_agua: c.frecuencia_agua || 7
        });
        setIdEdicion(c.id || null);
        toast('Editando cliente...', { icon: '✏️' });
    };

    return (
        <div style={styles.container}>
            <h2 style={{ marginTop: 0 }}>Gestión de Clientes</h2>

            {/* --- FORMULARIO --- */}
            <div style={styles.formPanel}>
                <div style={{ ...styles.row, flexDirection: isMobile ? 'column' : 'row' }}>
                    <input
                        name="nombre"
                        placeholder="Nombre Completo"
                        value={form.nombre}
                        onChange={handleChange}
                        style={{ ...styles.input, flex: 2 }}
                        autoComplete="off"
                    />
                    <input
                        name="telefono"
                        placeholder="Celular (09...)"
                        value={form.telefono}
                        onChange={handleChange}
                        style={{ ...styles.input, flex: 1 }}
                        maxLength={10}
                        inputMode="numeric"
                    />
                    <select name="categoria" value={form.categoria} onChange={handleChange} style={{ ...styles.input, flex: 1 }}>
                        <option value="Hogar">Hogar</option>
                        <option value="Negocio">Negocio</option>
                    </select>
                </div>

                <div style={{ ...styles.row, flexDirection: isMobile ? 'column' : 'row' }}>
                    <input
                        name="direccion"
                        placeholder="Dirección / Referencia"
                        value={form.direccion}
                        onChange={handleChange}
                        style={{ ...styles.input, flex: 2 }}
                    />
                    <div style={{ display: 'flex', gap: 10, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <input name="frecuencia_consumo" type="number" value={form.frecuencia_consumo} onChange={handleChange} style={{ ...styles.input, width: 50 }} />
                            <small>Gas</small>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <input name="frecuencia_agua" type="number" value={form.frecuencia_agua} onChange={handleChange} style={{ ...styles.input, width: 50 }} />
                            <small>Agua</small>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 15 }}>
                    <button onClick={guardar} style={{ ...styles.btn, flex: 2, backgroundColor: idEdicion ? '#E67E22' : '#2ecc71' }}>
                        {idEdicion ? 'Actualizar' : 'Guardar Nuevo'}
                    </button>
                    {idEdicion && (
                        <button onClick={eliminar} style={{ ...styles.btn, flex: 1, backgroundColor: '#c0392b' }}>Eliminar</button>
                    )}
                    <button onClick={limpiarForm} style={{ ...styles.btn, backgroundColor: '#444' }}>Limpiar</button>
                </div>
            </div>

            {/* --- BUSCADOR --- */}
            <div style={{ marginBottom: 10, display: 'flex', gap: 10 }}>
                <input
                    placeholder="🔍 Buscar por nombre o teléfono..."
                    value={busqueda}
                    onChange={e => { setBusqueda(e.target.value); cargarClientes(e.target.value) }}
                    style={{ ...styles.input, flex: 1 }}
                />
            </div>

            {/* --- LISTA DE RESULTADOS --- */}
            <div style={styles.listContainer}>
                {lista.length === 0 && <p style={{ textAlign: 'center', color: '#777' }}>No hay clientes registrados</p>}
                {lista.map(c => (
                    <div key={c.id} style={styles.card} onClick={() => cargarParaEditar(c)}>
                        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{c.nombre}</div>

                        {/* Dirección como texto simple (Sin mapa) */}
                        <div style={{ fontSize: '13px', color: '#aaa', marginTop: '4px' }}>
                            📞 {c.telefono} &nbsp;|&nbsp; 🏠 {c.direccion || 'Sin dirección'}
                        </div>

                        {c.categoria === 'Negocio' && (
                            <span style={styles.badgeNegocio}>Negocio</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- ESTILOS ---
const styles = {
    container: { padding: '20px', color: 'white', height: '100%', display: 'flex', flexDirection: 'column' as const, boxSizing: 'border-box' as const },
    formPanel: { backgroundColor: '#252525', padding: '15px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #333' },
    row: { display: 'flex', gap: '10px', marginBottom: '10px' } as React.CSSProperties,
    input: { padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#333', color: 'white', fontSize: '16px', outline: 'none' },
    btn: { padding: '12px', border: 'none', borderRadius: '5px', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' },
    listContainer: { flex: 1, overflowY: 'auto' as const, backgroundColor: '#222', borderRadius: '10px', padding: '10px', border: '1px solid #333' },
    card: { backgroundColor: '#333', padding: '15px', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', borderLeft: '4px solid #3498DB', position: 'relative' as const },
    badgeNegocio: { position: 'absolute' as const, top: '10px', right: '10px', backgroundColor: '#8e44ad', fontSize: '10px', padding: '3px 8px', borderRadius: '10px', fontWeight: 'bold' }
};

export default Clientes;