import axios from 'axios';

// Configuración base de axios
const instance = axios.create({
  baseURL: 'http://localhost:8000/api', // Cambia el puerto si es necesario
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Para manejar cookies de sesión
});

// Interceptor para requests
instance.interceptors.request.use(
  (config) => {
    // Agregar token si existe
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpiar localStorage y redirigir al login
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;