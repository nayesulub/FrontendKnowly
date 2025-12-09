// src/api/client.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://knowly-vkbg.onrender.com", // tu backend Laravel
  withCredentials: true,
});

export default api;
