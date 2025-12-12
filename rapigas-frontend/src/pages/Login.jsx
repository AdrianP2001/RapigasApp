import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook para cambiar de pantalla

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Limpiar errores previos

        try {
            // Hacemos POST a Laravel
            const response = await api.post('/login', { usuario, password });

            // Si Laravel responde OK (200):
            const { token, user } = response.data;

            // 1. Guardamos el token en el navegador
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // 2. Redirigimos al Dashboard (como el self.cambiar_vista en Tkinter)
            navigate('/dashboard');

        } catch (err) {
            // Manejo de error (equivalente al messagebox de error)
            setError('❌ Credenciales incorrectas o error de conexión');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={{ color: 'white' }}>RAPIGAS</h2>
                <h3 style={{ color: '#aaa' }}>Bienvenido</h3>

                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        style={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />

                    {error && <p style={{ color: 'orange' }}>{error}</p>}

                    <button type="submit" style={styles.button}>
                        INGRESAR
                    </button>
                </form>
            </div>
        </div>
    );
};

// Estilos simples tipo "Dark Mode" (simulando tu CustomTkinter)
const styles = {
    container: {
        height: '100vh',
        backgroundColor: '#1a1a1a',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        backgroundColor: '#2b2b2b',
        padding: '2rem',
        borderRadius: '15px',
        textAlign: 'center',
        width: '350px'
    },
    input: {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#404040',
        color: 'white'
    },
    button: {
        width: '100%',
        padding: '10px',
        marginTop: '15px',
        backgroundColor: '#2ecc71',
        border: 'none',
        borderRadius: '5px',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer'
    }
};

export default Login;






