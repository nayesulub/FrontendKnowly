# Imagen base de nginx
FROM nginx:alpine

# Copiamos el build al path público de nginx
COPY dist /usr/share/nginx/html

# Opcional: copiamos una config personalizada (si tienes rutas SPA con react-router-dom)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Puerto expuesto
EXPOSE 80

# Arranca NGINX
CMD ["nginx", "-g", "daemon off;"]