import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// 1. Interceptor de Solicitud (Envía el token)
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 2. Interceptor de Respuesta (Maneja el error 401)
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // Si el token venció o es inválido:
            localStorage.removeItem('token'); // Borrar token malo
            localStorage.removeItem('user');  // Borrar usuario
            window.location.href = '/login';  // Mandar al login a la fuerza
        }
        return Promise.reject(error);
    }
);

export default api;