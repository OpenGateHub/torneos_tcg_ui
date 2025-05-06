// src/services/axiosClient.js
import axios from 'axios';
import Cookies from 'js-cookie';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND, 
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token a las cabeceras de cada solicitud
axiosClient.interceptors.request.use(config => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default axiosClient;
