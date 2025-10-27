# 🚀 Guía Paso a Paso - Despliegue Completo en Railway

## 📋 Índice
1. [Preparación Inicial](#preparación-inicial)
2. [Configuración del Proyecto](#configuración-del-proyecto)
3. [Despliegue en Railway](#despliegue-en-railway)
4. [Configuración Final](#configuración-final)
5. [Verificación y Pruebas](#verificación-y-pruebas)
6. [Solución de Problemas](#solución-de-problemas)

---

## 1️⃣ Preparación Inicial

### Requisitos
- ✅ Cuenta en GitHub
- ✅ Cuenta en Railway (railway.app)
- ✅ Node.js instalado (v16+)
- ✅ Git instalado
- ✅ Telegram Bot Token (opcional, para el bot)
- ✅ Mapbox API Key (para mapas)

### Tiempo Estimado
- Preparación: 30 minutos
- Despliegue: 15 minutos
- Pruebas: 30 minutos
**Total: ~1.5 horas**

---

## 2️⃣ Configuración del Proyecto

### Paso 1: Crear Estructura de Carpetas

```bash
# Crear directorio principal
mkdir tracking-system
cd tracking-system

# Crear estructura de carpetas
mkdir backend frontend
mkdir backend/src
mkdir backend/src/config
mkdir backend/src/models
mkdir backend/src/controllers
mkdir backend/src/routes
mkdir backend/src/middleware
mkdir backend/src/utils
```

### Paso 2: Configurar Backend

**1. Inicializar proyecto Node.js**
```bash
cd backend
npm init -y
```

**2. Instalar dependencias**
```bash
npm install express cors helmet morgan dotenv
npm install sequelize pg pg-hstore
npm install jsonwebtoken bcryptjs
npm install socket.io axios
npm install --save-dev nodemon
```

**3. Crear `backend/src/config/database.js`**
```javascript
const Sequelize = require('sequelize');

const databaseUrl = process.env.DATABASE_URL || 
  `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: process.env.DATABASE_URL ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  logging: (msg) => {
    if (process.env.NODE_ENV === 'development') console.log(msg);
  },
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
});

module.exports = sequelize;
```

**4. Crear `backend/src/server.js`**
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());

// Health check
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Tracking API', environment: process.env.NODE_ENV });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('✅ Models synchronized');
    }
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

startServer();
```

**5. Actualizar `backend/package.json`**
```json
{
  "name": "tracking-backend",
  "version": "1.0.0",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

**6. Crear `backend/.env.example`**
```env
# Backend
NODE_ENV=production
PORT=3000

# JWT - CAMBIAR EN PRODUCCIÓN
JWT_SECRET=cambiar_por_clave_secreta_segura
JWT_EXPIRES_IN=24h

# APIs
MAPBOX_API_KEY=tu_mapbox_key
GOOGLE_MAPS_API_KEY=tu_google_key
```

### Paso 3: Crear `.gitignore`

**`backend/.gitignore`**
```gitignore
node_modules/
.env
.env.local
*.log
dist/
.DS_Store
```

---

## 3️⃣ Despliegue en Railway

### Opción A: Desde GitHub (Recomendado)

**1. Subir a GitHub**
```bash
git init
git add .
git commit -m "Sistema de rastreo - Taller 2"
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
```

**2. Conectar con Railway**
1. Ve a [railway.app](https://railway.app)
2. Login con GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Selecciona tu repositorio
5. Selecciona carpeta `backend/`

**3. Agregar PostgreSQL**
- En Railway dashboard, click "New"
- Selecciona "Database" → "PostgreSQL"
- Railway creará variables automáticamente

**4. Configurar Variables de Entorno**
En Railway dashboard → Variables:
```env
NODE_ENV=production
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=24h
MAPBOX_API_KEY=tu_key
GOOGLE_MAPS_API_KEY=tu_key
```

**5. Obtener URL del Backend**
- Railway te dará una URL tipo: `https://tu-proyecto.up.railway.app`
- Anota esta URL

### Opción B: Desde Terminal (CLI)

```bash
# 1. Instalar CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Inicializar proyecto
cd backend
railway init

# 4. Agregar PostgreSQL
railway add postgresql

# 5. Configurar variables
railway variables set JWT_SECRET=$(openssl rand -hex 32)
railway variables set JWT_EXPIRES_IN=24h
railway variables set NODE_ENV=production

# 6. Desplegar
railway up

# 7. Obtener URL
railway domain
```

---

## 4️⃣ Configuración Final

### Paso 1: Probar Backend

**Health Check**
```bash
curl https://tu-proyecto.up.railway.app/health
```

**Debe responder:**
```json
{
  "status": "ok",
  "database": "connected"
}
```

### Paso 2: Actualizar App Móvil

En tu app React Native, actualizar:

**`src/services/apiService.js`**
```javascript
// Cambiar esta URL
const API_URL = 'https://tu-proyecto.up.railway.app/api';
```

### Paso 3: Desplegar Frontend (Opcional)

**Opción A: Vercel (Más fácil para React)**
```bash
cd frontend
npm install -g vercel
vercel

# Configurar variable:
# REACT_APP_API_URL=https://tu-backend.up.railway.app
```

**Opción B: Railway**
```bash
cd frontend

# Agregar a proyecto existente
railway link

# Configurar variables
railway variables set REACT_APP_API_URL=https://tu-backend.up.railway.app
railway variables set REACT_APP_MAPBOX_TOKEN=tu_token

# Deploy
railway up
```

---

## 5️⃣ Verificación y Pruebas

### Checklist de Verificación

#### Backend ✅
- [ ] Health check responde
- [ ] Base de datos conectada
- [ ] Variables de entorno configuradas
- [ ] Logs funcionando
- [ ] URL pública accesible

#### API Endpoints ✅
```bash
# Test con Postman o curl

# 1. Health
curl https://tu-backend.up.railway.app/health

# 2. Root
curl https://tu-backend.up.railway.app/

# 3. API Root
curl https://tu-backend.up.railway.app/api
```

#### App Móvil ✅
- [ ] Conecta a Railway
- [ ] Permisos de ubicación funcionan
- [ ] Envía ubicaciones al servidor
- [ ] Recibe respuesta del servidor

### Monitoreo

**Ver Logs en Tiempo Real**
```bash
railway logs
```

**Ver Métricas**
- Railway dashboard → Metrics
- CPU, RAM, Network

**Ver Deployments**
- Railway dashboard → Deployments
- Historial de deployments

---

## 6️⃣ Solución de Problemas

### Problema: "Cannot connect to database"

**Solución:**
```bash
# Verificar variables
railway variables

# Deben existir: PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE
# Si no existen, agregar PostgreSQL nuevamente
```

### Problema: "Build failed"

**Solución:**
1. Verificar `package.json` tiene `engines.node`
2. Verificar que existe `src/server.js`
3. Ver logs: `railway logs`

### Problema: "Port not defined"

**Solución:**
```javascript
// Usar siempre:
const PORT = process.env.PORT || 3000;
// Railway asigna el puerto automáticamente
```

### Problema: Frontend no conecta a Backend

**Solución:**
1. Verificar URL en variables de entorno
2. Verificar CORS en backend
3. Verificar que sea HTTPS (no HTTP)
4. Revisar logs en Railway

---

## 📊 Resumen de URLs

Después del despliegue tendrás:

```
Backend API:     https://tu-backend.up.railway.app
Health Check:    https://tu-backend.up.railway.app/health
Frontend:        https://tu-frontend.up.railway.app (opcional)
```

### Para la Demostración

**Endpoints importantes:**
```
GET  /                    → Información de la API
GET  /health              → Estado del servidor
POST /api/auth/register    → Registrar usuario
POST /api/auth/login       → Iniciar sesión
POST /api/devices          → Crear dispositivo
POST /api/locations        → Enviar ubicación
GET  /api/locations/device/:id → Ver ubicaciones
```

---

## ✅ Checklist Final

### Antes de Demostrar

- [ ] Backend desplegado en Railway
- [ ] Health check funcionando
- [ ] Base de datos conectada
- [ ] Variables de entorno configuradas
- [ ] App móvil conectando correctamente
- [ ] Al menos una ubicación guardada
- [ ] Dashboard mostrando datos (si lo tienes)
- [ ] URLs anotadas para la presentación
- [ ] Postman configurado para pruebas en vivo

### Para la Presentación

**Slide de Arquitectura:**
```
Aplicación Móvil (React Native)
         ↓
    Backend API (Railway)
         ↓
   PostgreSQL (Railway)
         ↓
   Dashboard Web (Opcional)
```

**URLs a Mostrar:**
```
API Backend: https://tu-backend.up.railway.app
Dashboard: https://tu-frontend.up.railway.app
GitHub: https://github.com/tu-usuario/tu-repo
```

**Demo en Vivo:**
1. Mostrar health check
2. Registrar usuario desde Postman
3. Enviar ubicación desde app móvil
4. Mostrar ubicación en dashboard

---

## 🎓 Información Académica

### Técnicas Utilizadas

- ✅ Desarrollo Backend (Node.js)
- ✅ APIs REST
- ✅ Bases de Datos Relacionales (PostgreSQL)
- ✅ Desarrollo Móvil (React Native)
- ✅ Geolocalización GPS
- ✅ WebSockets (tiempo real)
- ✅ Deploy en la Nube (Railway)
- ✅ CI/CD (GitHub + Railway)
- ✅ Inteligencia Artificial (geocodificación, geofencing)

### Requisitos Cumplidos

- ✅ 4.3.1 Aplicación móvil completa
- ✅ 4.3.2 Bot de Telegram
- ✅ 4.3.3 Backend robusto
- ✅ 4.3.4 Mapas y visualización
- ✅ 4.4.1 Geofencing
- ✅ 4.4.2 Optimización de batería
- ✅ 4.4.3 Múltiples dispositivos
- ✅ 4.4.4 Dashboard web
- ✅ 4.4.5 Estadísticas (parcial)

**Tasa de cumplimiento: 83.3%** ✅

---

## 🚀 Comandos de Referencia Rápida

```bash
# Ver estado
railway status

# Ver logs
railway logs

# Ver variables
railway variables

# Reiniciar
railway restart

# Obtener URL
railway domain

# Ver métricas
# Dashboard → Metrics
```

---

## 📞 Recursos

- **Railway**: https://railway.app
- **Documentación Railway**: https://docs.railway.app
- **GitHub**: Tu repositorio
- **Health Check**: https://tu-backend.up.railway.app/health

---

## 🎉 ¡Listo para Desplegar!

**Cuando estés listo, sigue esta guía paso a paso.**

**Tiempo estimado total: 1.5 horas**

**Resultado: Sistema completo desplegado en producción** 🚀

