/**
 * Configuración global de la aplicación
 */

// ⚠️ IMPORTANTE: aquí NO debe llevar /api
export const API_ROOT_URL = import.meta.env.VITE_API_URL || "https://knowly-vkbg.onrender.com";

// Aquí SI le agregamos /api para endpoints
export const API_BASE_URL = `${API_ROOT_URL}/api`;

export const API_ENDPOINTS = {
  ACTIVIDADES: `${API_BASE_URL}/actividades`,
  ASIGNATURAS: `${API_BASE_URL}/asignaturas`,
  PREGUNTAS: `${API_BASE_URL}/preguntas`,
  CATEGORIAS: `${API_BASE_URL}/categorias`,
  CATEGORIAS_ALL: `${API_BASE_URL}/categorias-all`,
  USUARIOS: `${API_BASE_URL}/usuarios`,
  USER_ADD_POINTS: `${API_BASE_URL}/user/add-points`,

  LOGIN: `${API_BASE_URL}/login`,
  REGISTER: `${API_BASE_URL}/register`,

  LOGIN_GOOGLE: `${API_ROOT_URL}/login/google`,
};
