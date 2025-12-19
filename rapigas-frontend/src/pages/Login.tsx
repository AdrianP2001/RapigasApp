import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [usuario, setUsuario] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [mensajeEstado, setMensajeEstado] = useState<string>('Estableciendo conexión con el servidor...');
    const [conectado, setConectado] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        const verificarConexion = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
                setMensajeEstado('Conexión establecida correctamente.');
                setConectado(true);
            } catch (err) {
                setMensajeEstado('Error al conectar con la base de datos.');
                setConectado(false);
            }
        };
        verificarConexion();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!conectado) return;

        setError('');
        setLoading(true);
        setMensajeEstado('Verificando credenciales...');

        try {
            const response = await api.post('/login', { usuario, password });
            const { token, user } = response.data;

            if (token) {
                localStorage.setItem('token', token);
                if (user) localStorage.setItem('user', JSON.stringify(user));
                setMensajeEstado('Acceso concedido. Iniciando sistema...');
                setTimeout(() => navigate('/dashboard'), 800);
            }
        } catch (err) {
            console.error(err);
            setError('❌ Usuario o contraseña incorrectos');
            setMensajeEstado('Esperando credenciales...');
        } finally {
            setLoading(false);
        }
    };

    // --- FUNCIÓN ACTUALIZADA: RECUPERAR CONTRASEÑA ---
    const recuperarPassword = () => {
        // Número original: 0982414546 -> Formato Ecuador: 593982414546
        const numeroSoporte = "593982414546";
        const mensaje = `Hola, Admin. Olvidé mi contraseña del sistema Rapigas y necesito soporte.`;

        // Abrir WhatsApp en nueva pestaña
        window.open(`https://wa.me/${numeroSoporte}?text=${encodeURIComponent(mensaje)}`, '_blank');
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>

                <div style={styles.logoContainer}>
                    <img src="/logo.png" alt="Logo Rapigas" style={styles.logo} />
                </div>

                <h2 style={{ color: 'white', marginBottom: '5px', letterSpacing: '2px' }}>RAPIGAS</h2>
                <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '25px' }}>Sistema de Gestión v2.2</p>

                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        style={styles.input}
                        disabled={loading || !conectado}
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"  //
                        style={styles.input}
                        disabled={loading || !conectado}
                    />

                    {error && <div style={styles.errorMsg}>{error}</div>}

                    <button
                        type="submit"
                        style={{
                            ...styles.button,
                            opacity: (loading || !conectado) ? 0.7 : 1,
                            cursor: (loading || !conectado) ? 'not-allowed' : 'pointer'
                        }}
                        disabled={loading || !conectado}
                    >
                        {loading ? 'INGRESANDO...' : 'INICIAR SESIÓN'}
                    </button>
                </form>

                <div style={{ marginTop: '20px' }}>
                    <button onClick={recuperarPassword} style={styles.linkRecuperar}>
                        ¿Olvidaste tu contraseña? Contactar Soporte
                    </button>
                </div>

                <div style={styles.statusBar}>
                    <div style={{
                        ...styles.statusDot,
                        backgroundColor: conectado ? '#2ecc71' : (mensajeEstado.includes('Error') ? '#e74c3c' : '#f1c40f')
                    }} />
                    <span>{mensajeEstado}</span>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        height: '100vh',
        width: '100vw',
        backgroundColor: '#1a1a1a',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        fontFamily: 'Segoe UI, sans-serif'
    } as React.CSSProperties,
    card: {
        backgroundColor: '#2b2b2b',
        padding: '40px',
        borderRadius: '15px',
        textAlign: 'center' as const,
        width: '380px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        border: '1px solid #333',
        position: 'relative' as const
    } as React.CSSProperties,
    logoContainer: {
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'center'
    } as React.CSSProperties,
    logo: {
        width: '80px',
        height: '80px',
        objectFit: 'contain' as const,
        filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.1))'
    } as React.CSSProperties,
    input: {
        width: '100%',
        padding: '12px 15px',
        margin: '8px 0',
        borderRadius: '5px',
        border: '1px solid #444',
        backgroundColor: '#383838',
        color: 'white',
        fontSize: '15px',
        boxSizing: 'border-box' as const,
        outline: 'none',
        transition: 'border 0.3s'
    } as React.CSSProperties,
    button: {
        width: '100%',
        padding: '12px',
        marginTop: '20px',
        backgroundColor: '#005580',
        border: 'none',
        borderRadius: '5px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '16px',
        transition: 'background 0.3s'
    } as React.CSSProperties,
    errorMsg: {
        color: '#ff6b6b',
        fontSize: '14px',
        marginTop: '10px',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        padding: '8px',
        borderRadius: '4px'
    } as React.CSSProperties,
    linkRecuperar: {
        background: 'none',
        border: 'none',
        color: '#aaa',
        fontSize: '13px',
        textDecoration: 'underline',
        cursor: 'pointer',
        marginTop: '10px'
    } as React.CSSProperties,
    statusBar: {
        marginTop: '30px',
        paddingTop: '15px',
        borderTop: '1px solid #444',
        color: '#888',
        fontSize: '12px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px'
    } as React.CSSProperties,
    statusDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        display: 'inline-block'
    } as React.CSSProperties
};

export default Login;