import axios from 'axios';

// Configura la URL base de tu Laravel (asegúrate que Laravel corra en el puerto 8000)
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor: Agrega el token automáticamente a cada petición
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); // Recuperamos el token guardado
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;