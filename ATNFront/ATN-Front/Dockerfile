# --- Etapa 1: Construcción (Build) ---
FROM node:20-alpine AS build

# El directorio de trabajo es la raíz de la app
WORKDIR /app

# Copia los archivos de manifiesto. Como el Dockerfile está en la misma
# carpeta, la ruta es simple.
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Ejecuta el build
RUN npm run build

# --- Etapa 2: Servicio (Serve) ---
FROM nginx:stable-alpine

# Copia la configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos estáticos desde la etapa de build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]