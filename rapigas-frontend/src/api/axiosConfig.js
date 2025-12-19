import axios from 'axios';

// Asegúrate de usar TU IP LOCAL aquí
const baseURL = 'http://192.168.100.19:8000/api';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000 // 10s timeout
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            if (error.response.status === 401) {
                localStorage.clear();
                window.location.href = '/login';
            } else if (error.response.status === 500) {
                console.error('🔥 Error Servidor:', error.response.data);
                alert('Error interno del servidor. Intente más tarde.');
            }
        } else if (error.code === 'ECONNABORTED') {
            alert('La solicitud tardó demasiado. Revise su conexión.');
        } else {
            console.error('Error de red:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;