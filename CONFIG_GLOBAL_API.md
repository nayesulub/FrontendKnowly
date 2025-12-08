# Configuración Global de API

## 📋 Resumen
Se ha creado un sistema centralizado de configuración de URLs de API en el archivo `src/utils/config.js`. Esto permite cambiar fácilmente entre desarrollo y producción sin modificar el código en múltiples lugares.

## 🔧 Cómo funciona

### Archivo de configuración: `src/utils/config.js`
```javascript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  ACTIVIDADES: `${API_BASE_URL}/actividades`,
  ASIGNATURAS: `${API_BASE_URL}/asignaturas`,
  PREGUNTAS: `${API_BASE_URL}/preguntas`,
  CATEGORIAS: `${API_BASE_URL}/categorias`,
  CATEGORIAS_ALL: `${API_BASE_URL}/categorias-all`,
  USUARIOS: `${API_BASE_URL}/usuarios`,
  USER_ADD_POINTS: `${API_BASE_URL}/user/add-points`,
};
```

### Variables de entorno

#### `.env` (Desarrollo local)
```
VITE_API_URL=http://localhost:8000/api
```

#### `.env.production` (Producción)
```
VITE_API_URL=https://knowly-vkbg.onrender.com
```

## 📝 Cómo usar

### Opción 1: Importar desde `API_ENDPOINTS` (Recomendado)
```jsx
import { API_ENDPOINTS } from '../utils/config';

// En tu componente
const API_URL = API_ENDPOINTS.ACTIVIDADES;

fetch(API_URL)
  .then(res => res.json())
  .then(data => console.log(data));
```

### Opción 2: Importar `API_BASE_URL` directamente
```jsx
import { API_BASE_URL } from '../utils/config';

// Para construir URLs dinámicas
const url = `${API_BASE_URL}/actividades/${id}`;
```

## 🔄 Cambiar entre desarrollo y producción

**Desarrollo local:**
- Asegúrate de que tu variable `VITE_API_URL` en `.env` apunte a `http://localhost:8000/api`
- Ejecuta: `npm run dev`

**Producción:**
- Vite automáticamente usará `.env.production` cuando ejecutes: `npm run build`
- La variable `VITE_API_URL` estará configurada como `https://knowly-vkbg.onrender.com`

## 📌 Archivos actualizados
✅ `src/utils/config.js` - Archivo de configuración central
✅ `src/Components/Dash/Grados.jsx` - Panel de grados
✅ `src/Components/Dash/Gestion.jsx` - Gestión de asignaturas
✅ `src/Components/Dash/Categorias.jsx` - Gestión de categorías
✅ `src/Components/Dash/Nivel.jsx` - Gestión de usuarios
✅ `src/Components/Asignaturas.jsx` - Vista de asignaturas
✅ `src/Components/Actividades.jsx` - Vista de actividades
✅ `src/Components/Pago.jsx` - Módulo de pago
✅ `src/Components/Pagos.jsx` - Gestión de pagos
✅ `src/Components/Precios.jsx` - Vista de precios
✅ `src/Components/Ejercicios/EjerciciosPreguntas.jsx` - Ejercicios
✅ `src/api/axios.jsx` - Instancia de axios
✅ `.env.production` - Crear nuevo archivo

## 🚀 Fácil cambio de URL
Si necesitas cambiar la URL de la API en el futuro, solo necesitas:

1. **Para desarrollo:** Editar `.env`
2. **Para producción:** Editar `.env.production`

¡Ya no necesitas buscar y reemplazar URLs en múltiples archivos!
