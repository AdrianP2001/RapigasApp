import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [usuario, setUsuario] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Petición al backend Laravel
            const response = await api.post('/login', { usuario, password });
            
            // Verificamos la respuesta (ajusta según lo que devuelva tu AuthController)
            // Si tu AuthController devuelve { token: "...", user: {...} }
            const { token, user } = response.data;
            
            if (token) {
                localStorage.setItem('token', token);
                if (user) localStorage.setItem('user', JSON.stringify(user));
                navigate('/dashboard'); // Redirigir al dashboard
            } else {
                // Si usaste la versión que devuelve { access_token: "..." }
                const { access_token } = response.data;
                if(access_token) {
                    localStorage.setItem('token', access_token);
                    navigate('/dashboard');
                }
            }

        } catch (err) {
            console.error(err);
            setError('❌ Usuario o contraseña incorrectos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={{color: 'white', marginBottom: '10px'}}>RAPIGAS</h2>
                <p style={{color: '#aaa', marginBottom: '20px'}}>Bienvenido al Sistema</p>
                
                <form onSubmit={handleLogin}>
                    <input 
                        type="text" 
                        placeholder="Usuario" 
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        style={styles.input}
                        disabled={loading}
                    />
                    <input 
                        type="password" 
                        placeholder="Contraseña" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        disabled={loading}
                    />
                    
                    {error && <p style={{color: '#ff4444', fontSize: '14px'}}>{error}</p>}

                    <button 
                        type="submit" 
                        style={{...styles.button, opacity: loading ? 0.7 : 1}}
                        disabled={loading}
                    >
                        {loading ? 'VERIFICANDO...' : 'INGRESAR'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Estilos CSS-in-JS (Simulando el modo oscuro de CustomTkinter)
const styles = {
    container: {
        height: '100vh',
        width: '100vw',
        backgroundColor: '#1a1a1a', // Fondo oscuro principal
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
    } as React.CSSProperties,
    card: {
        backgroundColor: '#2b2b2b', // Fondo de la tarjeta
        padding: '2.5rem',
        borderRadius: '20px',
        textAlign: 'center' as const,
        width: '350px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
    } as React.CSSProperties,
    input: {
        width: '100%',
        padding: '12px',
        margin: '10px 0',
        borderRadius: '8px',
        border: '1px solid #404040',
        backgroundColor: '#404040',
        color: 'white',
        fontSize: '16px',
        boxSizing: 'border-box' as const
    } as React.CSSProperties,
    button: {
        width: '100%',
        padding: '12px',
        marginTop: '20px',
        backgroundColor: '#2ecc71', // Color verde Rapigas
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '16px'
    } as React.CSSProperties
};

export default Login;