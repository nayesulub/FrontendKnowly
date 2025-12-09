// src/api/client.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 👈 NADA de localhost aquí
  withCredentials: true,
});

export default api;