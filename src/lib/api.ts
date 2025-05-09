
import axios from 'axios';

// Determina si estamos en desarrollo o producción
const isDevelopment = import.meta.env.DEV;

// Base URL para las peticiones API
const baseURL = isDevelopment 
  ? 'http://localhost:3000/api' 
  : '/api';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para incluir el token JWT en las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si es un error 401, eliminar el token y recargar la página
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
