# 📍 Sistema de Rastreo Geográfico - Taller 2 Redes MCIC

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-61dafb.svg)

Sistema completo de rastreo geográfico en tiempo real con aplicación móvil, backend REST API y panel web de visualización.

## 📋 Índice

- [Descripción](#descripción)
- [Características](#características)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Documentación](#documentación)
- [Despliegue](#despliegue)
- [Autores](#autores)

## 📖 Descripción

### Objetivo del Taller

**Parte IV. Programación - Utilizando técnicas, aplicaciones e Inteligencia Artificial**

Crear una app, programa o bot para rastrear (ubicar) números telefónicos de servicios de mensajería instantánea como WhatsApp, Telegram, o directamente la ubicación geográfica de un celular.

### Nuestra Solución

Sistema completo de rastreo geográfico que permite monitorear ubicaciones en tiempo real a través de una aplicación móvil Android. Los datos se visualizan en un panel web interactivo con mapas, y se almacenan en una base de datos PostgreSQL. El sistema incluye:

- **📱 Rastreo de ubicación geográfica** de dispositivos móviles mediante GPS
- **🤖 Integración con Telegram** para notificaciones y compartir ubicaciones
- **💬 Compartir por WhatsApp** mediante deep links
- **🗺️ Visualización en tiempo real** en panel web interactivo
- **📊 Análisis de rutas** con gráficos y estadísticas
- **🔔 Sistema de alertas** mediante geocercas geográficas

### Componentes del Sistema

- **📱 Aplicación Móvil**: App React Native para Android que captura y envía ubicaciones GPS
- **🔧 Backend API**: Servidor Node.js/Express con autenticación JWT y almacenamiento PostgreSQL
- **💻 Frontend Web**: Panel de visualización React con mapas interactivos Leaflet
- **🤖 Bot Telegram**: Notificaciones y compartir ubicaciones vía Telegram
- **🗺️ Geocercas**: Sistema de alertas por entrada/salida de zonas geográficas

## ✨ Características

### Rastreo de Ubicaciones
- ✅ Captura GPS en tiempo real con alta precisión
- ✅ Envío automático cada minuto (configurable)
- ✅ Geocodificación inversa (coordenadas → dirección)
- ✅ Historial completo de ubicaciones
- ✅ Visualización en mapa interactivo con trayectorias
- ✅ **NUEVO** 🎉 Exportar historial a CSV
- ✅ **NUEVO** 🎉 Compartir ubicación por WhatsApp
- ✅ **NUEVO** 🎉 Gráficos interactivos de análisis de rutas

### Gestión de Dispositivos
- ✅ Registro múltiple de dispositivos por usuario
- ✅ Estado activo/inactivo de dispositivos
- ✅ Última conexión visible
- ✅ Tipos de dispositivo (móvil, GPS, otros)

### Seguridad
- ✅ Autenticación JWT
- ✅ Encriptación de contraseñas (bcrypt)
- ✅ Validación de datos en backend
- ✅ Sanitización de entradas
- ✅ Tokens de sesión seguros

### Notificaciones
- ✅ Bot de Telegram integrado
- ✅ Compartir ubicación en tiempo real
- ✅ Alertas de geocercas
- ✅ Notificaciones de dispositivos

### Interfaz Web
- ✅ Dashboard con estadísticas
- ✅ Mapas interactivos (OpenStreetMap)
- ✅ Auto-actualización cada 30 segundos
- ✅ Diseño responsive y moderno
- ✅ Filtros por fecha y dispositivo

## 🏗️ Arquitectura

```
┌─────────────────┐
│  Aplicación     │  ← Usuario con teléfono Android
│    Móvil        │     (Captura GPS cada 1 min)
│  (React Native) │
└────────┬────────┘
         │ HTTPS/REST API
         │
         ↓
┌─────────────────┐
│    Backend      │  ← Servidor Node.js en Railway
│   (Express.js)  │     (Autentica, valida, procesa)
│   + PostgreSQL  │     (Almacena en base de datos)
└────────┬────────┘
         │
         ├─→ Telegram Bot (Notificaciones)
         │
         ↓
┌─────────────────┐
│   Frontend      │  ← Panel web de visualización
│   (React.js)    │     (Muestra mapas, estadísticas)
│   + Leaflet     │     (Auto-actualiza cada 30s)
└─────────────────┘
```

### Flujo de Datos

1. **Captura**: La app móvil obtiene coordenadas GPS del dispositivo
2. **Envío**: POST a `/api/locations` con coordenadas + deviceId + token
3. **Procesamiento**: Backend valida, geocodifica dirección, guarda en PostgreSQL
4. **Almacenamiento**: Datos persistidos con timestamp y metadata
5. **Visualización**: Frontend consulta GET `/api/locations/device/:id` y muestra en mapa
6. **Notificaciones**: Bot de Telegram notifica eventos importantes

## 🛠️ Tecnologías

### Backend
- **Node.js** v18+ - Runtime de JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos relacional
- **Sequelize** - ORM para PostgreSQL
- **JWT** - Autenticación con tokens
- **Bcrypt** - Encriptación de contraseñas
- **Telegram Bot API** - Notificaciones

### Frontend
- **React** 18 - Librería UI
- **Vite** - Build tool moderno
- **React Router** - Enrutamiento
- **Leaflet** - Mapas interactivos
- **Tailwind CSS** - Estilos modernos
- **React Hot Toast** - Notificaciones

### Móvil
- **React Native** - Framework multiplataforma
- **Expo** - Herramientas de desarrollo
- **Expo Location** - API de geolocalización
- **AsyncStorage** - Almacenamiento local
- **Axios** - Cliente HTTP

### DevOps
- **Railway** - Hosting y deployment
- **Git** - Control de versiones
- **GitHub** - Repositorio de código

## 📦 Requisitos

### Desarrollo Local

- **Node.js** >= 18.0.0
- **npm** o **yarn**
- **PostgreSQL** >= 14
- **Android Studio** (para compilar APK)
- **Git**

### Para Usuario Final

- **Smartphone Android** >= 8.0
- **Navegador web** moderno (Chrome, Firefox, Safari)
- **Conexión a internet**

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/taller2-redes.git
cd taller2-redes
```

### 2. Backend

```bash
cd backend
npm install

# Crear archivo .env
cat > .env << EOF
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/rastreo_db
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
PORT=3000
NODE_ENV=development
TELEGRAM_BOT_TOKEN=tu_token_de_telegram
EOF

# Iniciar servidor
npm start
```

### 3. Frontend

```bash
cd frontend
npm install

# Crear archivo .env
cat > .env << EOF
VITE_API_URL=http://localhost:3000
EOF

# Iniciar desarrollo
npm run dev
```

### 4. Aplicación Móvil

```bash
cd mobile
npm install

# Configurar API en src/config/api.js
# Cambiar la URL a tu servidor local o Railway

# Iniciar con Expo
npm start

# O compilar APK
cd android
./gradlew assembleDebug
# APK en: android/app/build/outputs/apk/debug/app-debug.apk
```

## 📱 Uso

### Aplicación Móvil

1. **Instalar APK** en dispositivo Android
2. **Abrir app** RastreoApp
3. **Registrarse** con email y contraseña
4. **Otorgar permisos** de ubicación (siempre permitir)
5. **Presionar "INICIAR RASTREO"**
6. La app enviará ubicaciones automáticamente cada 1 minuto

### Panel Web

1. **Abrir navegador** en https://rastreoapp-frontend-production.up.railway.app
2. **Iniciar sesión** con las mismas credenciales de la app
3. **Ver Dashboard** con estadísticas generales
4. **Ver Ubicaciones** en mapa interactivo
5. **Gestionar Dispositivos** registrados
6. **Configurar Geocercas** (opcional)

### Bot de Telegram

1. Buscar `@tu_bot` en Telegram
2. Iniciar conversación con `/start`
3. Vincular cuenta con `/link`
4. Recibir notificaciones automáticas

## 📚 Documentación

La documentación completa está organizada en la carpeta `docs/`:

### Guías de Usuario
- **[Guía de Instalación](docs/GUIA_INSTALACION.md)** - Instalación paso a paso
- **[Guía de Uso](docs/GUIA_USO.md)** - Cómo usar el sistema
- **[FAQ](docs/FAQ.md)** - Preguntas frecuentes

### Documentación Técnica
- **[Arquitectura del Sistema](docs/ARQUITECTURA.md)** - Diseño y componentes
- **[API Reference](docs/API_REFERENCE.md)** - Endpoints y ejemplos
- **[Base de Datos](docs/DATABASE.md)** - Esquema y modelos

### Desarrollo
- **[Configuración del Entorno](docs/SETUP_DESARROLLO.md)** - Setup local
- **[Guía de Contribución](docs/CONTRIBUTING.md)** - Cómo contribuir
- **[Generar APK](docs/GENERAR_APK.md)** - Compilar app Android

### Despliegue
- **[Desplegar en Railway](docs/DESPLIEGUE_RAILWAY.md)** - Deployment en producción
- **[Variables de Entorno](docs/VARIABLES_ENTORNO.md)** - Configuración

## 🌐 Despliegue

### URLs de Producción

- **Backend API**: https://rastreoapp-production.up.railway.app
- **Frontend Web**: https://rastreoapp-frontend-production.up.railway.app
- **Health Check**: https://rastreoapp-production.up.railway.app/health

### Desplegar en Railway

1. **Conectar repositorio** a Railway
2. **Configurar servicios**:
   - Backend (Node.js)
   - Frontend (Static Site)
   - PostgreSQL (Database)
3. **Configurar variables de entorno**
4. **Hacer push** a la rama main
5. Railway despliega automáticamente

Ver [docs/DESPLIEGUE_RAILWAY.md](docs/DESPLIEGUE_RAILWAY.md) para detalles completos.

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test

# Linting
npm run lint

# Type checking
npm run type-check
```

## 📊 Estadísticas del Proyecto

- **Líneas de código**: ~8,000+
- **Componentes React**: 15+
- **Endpoints API**: 25+
- **Modelos de datos**: 5
- **Tiempo de desarrollo**: 2 semanas

## 🔒 Seguridad

- ✅ Autenticación JWT con tokens seguros
- ✅ Contraseñas hasheadas con bcrypt (10 rounds)
- ✅ Validación de datos en backend
- ✅ Sanitización de inputs
- ✅ CORS configurado correctamente
- ✅ Helmet.js para headers de seguridad
- ✅ Rate limiting (pendiente)

## 🐛 Problemas Conocidos

- En Android, el rastreo en background puede detenerse si se optimiza la batería
- La geocodificación inversa depende de servicios externos (OpenStreetMap Nominatim)
- El auto-refresh del frontend consume ancho de banda

**Soluciones**: Ver [docs/SOLUCIONAR_PROBLEMAS.md](docs/SOLUCIONAR_PROBLEMAS.md)

## 🗺️ Roadmap

### Completado ✅
- [x] Sistema de autenticación
- [x] Captura de ubicaciones GPS
- [x] API REST completa
- [x] Panel web con mapas
- [x] App móvil Android
- [x] Bot de Telegram
- [x] Geocercas
- [x] Geocodificación inversa
- [x] Despliegue en Railway

### Completado en v1.1.0 ✅ (Nov 5, 2025)
- [x] Exportar historial a CSV ⭐
- [x] Compartir ubicación por WhatsApp ⭐
- [x] Gráficos de análisis de rutas ⭐

### Pendiente 🔄
- [ ] Soporte iOS
- [ ] Notificaciones push en app
- [ ] Exportar a KML/GPX
- [ ] Modo offline
- [ ] Multi-idioma
- [ ] Compartir por Email

## 👥 Autores

**Taller No. 2 - REDES MCIC**

- **Jhon Helmit León Sandoval** - Código: 20141093012
- **Jaime Andrés Parra Fajardo** - Código: 20251093001
- **Thomas Felipe Peña Herrera** - Código: 20251092005
- **David Eduardo Rojas Sánchez** - Código: 20251093006

**Universidad Distrital Francisco José de Caldas**  
**Maestría en Ciencias de la Información y las Comunicaciones (MCIC)**  
**Curso**: Redes de Computadores  
**Fecha**: Noviembre 2025

## 📄 Licencia

Este proyecto es parte de un trabajo académico para el curso de Redes MCIC.

## 🙏 Agradecimientos

- OpenStreetMap por los mapas gratuitos
- Railway por el hosting
- Expo por las herramientas de React Native
- Leaflet por la librería de mapas
- La comunidad de Stack Overflow

## 📞 Soporte

Para reportar problemas o solicitar ayuda:

1. **Issues de GitHub**: [Crear issue](https://github.com/tu-usuario/taller2-redes/issues)
2. **Documentación**: Ver carpeta `docs/`
3. **Email**: tu-email@universidad.edu

## 🔗 Enlaces Útiles

- [Documentación Oficial](docs/)
- [API Reference](docs/API_REFERENCE.md)
- [Guía de Instalación](docs/GUIA_INSTALACION.md)
- [FAQ](docs/FAQ.md)
- [Backend Repository](https://github.com/tu-usuario/taller2-redes/tree/main/backend)
- [Frontend Repository](https://github.com/tu-usuario/taller2-redes/tree/main/frontend)
- [Mobile Repository](https://github.com/tu-usuario/taller2-redes/tree/main/mobile)

---

**⭐ Si este proyecto te fue útil, no olvides darle una estrella en GitHub!**

**🚀 Desarrollado con ❤️ para el curso de Redes MCIC**
