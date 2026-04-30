import axios from 'axios';

// Creamos una instancia conectada a la URL de tu backend
export const api = axios.create({
  baseURL: 'http://localhost:3000', // Cambia esto si tu backend NestJS usa otro puerto
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el token en cada petición automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});