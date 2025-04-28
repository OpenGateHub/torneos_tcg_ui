// src/services/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND, 
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosClient;
