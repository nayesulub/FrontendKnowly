/**
 * Configuración global de la aplicación
 */

// URL base de la API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://knowly-vkbg.onrender.com/api';

// URL base sin /api para endpoints como /login/google
export const API_ROOT_URL = API_BASE_URL.replace('/api', '');

// Endpoints de la API
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





//// pruebas de local