import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

interface Cliente {
    id?: number; nombre: string; telefono: string; direccion: string;
    categoria: string; frecuencia_consumo: number; frecuencia_agua: number;
}

const Clientes: React.FC = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [form, setForm] = useState<Cliente>({
        nombre: '', telefono: '', direccion: '', categoria: 'Hogar',
        frecuencia_consumo: 20, frecuencia_agua: 7
    });
    const [idEdicion, setIdEdicion] = useState<number | null>(null);
    const [lista, setLista] = useState<Cliente[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [mensaje, setMensaje] = useState({ text: '', color: '' });

    useEffect(() => { cargarClientes(); }, []);

    const cargarClientes = async (query = '') => {
        try {
            const url = query ? `/clientes/buscar?q=${query}` : '/clientes';
            const res = await api.get(url);
            setLista(res.data);
        } catch (e) { console.error(e); }
    };

    const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

    const guardar = async () => {
        if (!form.nombre || !form.telefono || form.telefono.length !== 10) {
            setMensaje({ text: '❌ Datos inválidos (Revise el celular)', color: '#ff4444' }); return;
        }
        try {
            // Enviamos siempre el ID si estamos editando
            await api.post('/clientes', { ...form, id: idEdicion });
            setMensaje({ text: idEdicion ? '✅ Cliente Actualizado' : '✅ Cliente Guardado', color: '#2ecc71' });
            limpiarForm();
            cargarClientes();
        } catch (e) { setMensaje({ text: '❌ Error al guardar', color: '#ff4444' }); }
    };

    const eliminar = async () => {
        if (!idEdicion || !window.confirm("¿Seguro que deseas eliminar este cliente?")) return;
        try {
            await api.delete(`/clientes/${idEdicion}`);
            setMensaje({ text: '🗑️ Cliente eliminado', color: 'gray' });
            limpiarForm();
            cargarClientes();
        }
        catch { setMensaje({ text: '❌ No se puede eliminar (Tiene historial de ventas)', color: '#ff4444' }); }
    };

    const limpiarForm = () => {
        setForm({ nombre: '', telefono: '', direccion: '', categoria: 'Hogar', frecuencia_consumo: 20, frecuencia_agua: 7 });
        setIdEdicion(null); setMensaje({ text: '', color: '' });
    };

    // --- CORRECCIÓN CLAVE: FORMATEAR AL CARGAR ---
    const cargarParaEditar = (c: Cliente) => {
        // 1. Convertir teléfono de 593 a 09 para que encaje en el input
        let tel = c.telefono || '';
        if (tel.startsWith('593')) tel = '0' + tel.substring(3);

        // 2. Manejar nulos en dirección para evitar error de React
        setForm({
            ...c,
            telefono: tel,
            direccion: c.direccion || '', // Evita null
            frecuencia_consumo: c.frecuencia_consumo || 20,
            frecuencia_agua: c.frecuencia_agua || 7
        });
        setIdEdicion(c.id || null);
        setMensaje({ text: '✏️ Editando...', color: '#E67E22' });
    };

    return (
        <div style={styles.container}>
            <h2 style={{ marginTop: 0 }}>Gestión de Clientes</h2>

            <div style={styles.formPanel}>
                <div style={{ ...styles.row, flexDirection: isMobile ? 'column' : 'row' }}>
                    <input name="nombre" placeholder="Nombre Completo" value={form.nombre} onChange={handleChange} style={{ ...styles.input, flex: 2 }} />
                    <input name="telefono" placeholder="Celular (09...)" value={form.telefono} onChange={handleChange} style={{ ...styles.input, flex: 1 }} maxLength={10} />
                    <select name="categoria" value={form.categoria} onChange={handleChange} style={{ ...styles.input, flex: 1 }}>
                        <option value="Hogar">Hogar</option>
                        <option value="Negocio">Negocio</option>
                    </select>
                </div>

                <div style={{ ...styles.row, flexDirection: isMobile ? 'column' : 'row' }}>
                    <input name="direccion" placeholder="Dirección / Referencia" value={form.direccion} onChange={handleChange} style={{ ...styles.input, flex: 2 }} />
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
                <p style={{ color: mensaje.color, textAlign: 'center', marginTop: 10, minHeight: '20px' }}>{mensaje.text}</p>
            </div>

            <div style={{ marginBottom: 10, display: 'flex', gap: 10 }}>
                <input placeholder="🔍 Buscar..." value={busqueda} onChange={e => { setBusqueda(e.target.value); cargarClientes(e.target.value) }} style={{ ...styles.input, flex: 1 }} />
            </div>

            <div style={styles.listContainer}>
                {lista.map(c => (
                    <div key={c.id} style={styles.card} onClick={() => cargarParaEditar(c)}>
                        <div style={{ fontWeight: 'bold' }}>{c.nombre}</div>
                        <div style={{ fontSize: '13px', color: '#aaa' }}>📞 {c.telefono} | {c.direccion}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '20px', color: 'white', height: '100%', display: 'flex', flexDirection: 'column' as const, boxSizing: 'border-box' as const },
    formPanel: { backgroundColor: '#252525', padding: '15px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #333' },
    row: { display: 'flex', gap: '10px', marginBottom: '10px' } as React.CSSProperties,
    input: { padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#333', color: 'white', fontSize: '16px' },
    btn: { padding: '12px', border: 'none', borderRadius: '5px', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
    listContainer: { flex: 1, overflowY: 'auto' as const, backgroundColor: '#222', borderRadius: '10px', padding: '10px', border: '1px solid #333' },
    card: { backgroundColor: '#333', padding: '12px', borderRadius: '5px', marginBottom: '8px', cursor: 'pointer', borderLeft: '4px solid #005580' }
};

export default Clientes;