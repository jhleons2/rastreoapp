# 🚀 Tracking Backend API

Backend del sistema de rastreo geográfico para Taller 2 Redes MCIC.

## 📋 Características

- ✅ API REST con Express.js
- ✅ Base de datos PostgreSQL con Sequelize
- ✅ Autenticación JWT
- ✅ WebSockets para tiempo real
- ✅ Endpoints de ubicación
- ✅ Geofencing
- ✅ Ready para Railway

## 🚀 Instalación Local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar en desarrollo
npm run dev
```

## 🚂 Despliegue en Railway

Ver [GUIA_DESPLIEGUE_PASO_A_PASO.md](../GUIA_DESPLIEGUE_PASO_A_PASO.md)

## 📚 Documentación

- Health check: `/health`
- API: `/api`

## 📝 Variables de Entorno

Ver `.env.example` para todas las variables necesarias.

## 🔧 Scripts

- `npm start` - Inicia en producción
- `npm run dev` - Inicia en desarrollo con nodemon

## 📖 Uso

El backend debe ejecutarse en un puerto (por defecto 3000).
Railway asigna el puerto automáticamente.

Para más información, ver la documentación completa en la raíz del proyecto.

