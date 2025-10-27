# 🚂 Despliegue Completo en Railway - Taller 2 Redes MCIC

## 🎯 Objetivo
Desplegar **TODO** el sistema de rastreo en Railway:
- ✅ Backend API (Node.js)
- ✅ Base de datos PostgreSQL
- ✅ Dashboard Web (React)
- ✅ Variables de entorno
- ✅ Dominio personalizado

---

## 📦 Estructura del Proyecto para Railway

```
tracking-system/
├── backend/                 # API Node.js
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── railway.json
│
├── frontend/                # Dashboard React
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── railway.json
│
├── .github/
│   └── workflows/          # CI/CD automático
│
└── README.md
```

---

## 🚀 PASO 1: Preparar Backend para Railway

### 1.1 Crear archivo `backend/railway.json`

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 1.2 Actualizar `backend/package.json`

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
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^6.0.1",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.1",
    "sequelize": "^6.29.0",
    "pg": "^8.11.0",
    "pg-hstore": "^2.3.4",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "socket.io": "^4.5.4",
    "axios": "^1.4.0"
  }
}
```

### 1.3 Crear `backend/src/config/database.js` (Versión Railway)

```javascript
const Sequelize = require('sequelize');
require('dotenv').config();

// Railway automáticamente proporciona DATABASE_URL cuando agregas PostgreSQL
const databaseUrl = process.env.DATABASE_URL || 
  `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;

console.log('📊 Configurando conexión a base de datos...');
console.log(`Host: ${process.env.PGHOST || 'N/A'}`);
console.log(`Database: ${process.env.PGDATABASE || 'N/A'}`);

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
    if (process.env.NODE_ENV === 'development') {
      console.log(msg);
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;
```

### 1.4 Crear `backend/src/server.js` (Producción-Ready)

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const sequelize = require('./config/database');

const app = express();

// Railway asigna el puerto automáticamente
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HEALTH CHECK - Crítico para Railway
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ 
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Ruta principal
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Tracking API - Taller 2 Redes MCIC',
    description: 'Sistema de rastreo geográfico',
    endpoints: {
      health: '/health',
      api: '/api'
    },
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Importar rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/devices', require('./routes/devices'));
app.use('/api/locations', require('./routes/locations'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
const startServer = async () => {
  try {
    console.log('🚀 Iniciando servidor...');
    console.log(`📦 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔧 Node version: ${process.version}`);
    
    // Conectar a base de datos
    await sequelize.authenticate();
    console.log('✅ Base de datos conectada correctamente');
    
    // Sincronizar modelos solo en desarrollo
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('✅ Modelos de base de datos sincronizados');
    }
    
    // Iniciar servidor
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Servidor corriendo en puerto ${PORT}`);
      console.log(`🌐 URL: http://0.0.0.0:${PORT}`);
      console.log(`❤️  Health check: http://0.0.0.0:${PORT}/health`);
    });
    
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error.message);
    process.exit(1);
  }
};

// Manejo graceful de señales
process.on('SIGTERM', async () => {
  console.log('⚠️ SIGTERM recibido, cerrando conexiones...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('⚠️ SIGINT recibido, cerrando conexiones...');
  await sequelize.close();
  process.exit(0);
});

startServer();
```

---

## 🎨 PASO 2: Preparar Frontend (Dashboard) para Railway

### 2.1 Crear `frontend/railway.json`

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npx serve -s build -l 3000",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 2.2 Actualizar `frontend/package.json`

```json
{
  "name": "tracking-dashboard",
  "version": "0.1.0",
  "private": true,
  "homepage": ".",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.1",
    "axios": "^1.3.0",
    "mapbox-gl": "^2.15.0",
    "recharts": "^2.5.0",
    "socket.io-client": "^4.6.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "devDependencies": {
    "serve": "^14.2.0"
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version"]
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

### 2.3 Crear `.env` para producción (NO subir a Git)

```env
# URL del backend desplegado en Railway
REACT_APP_API_URL=https://tu-backend.railway.app
REACT_APP_WS_URL=wss://tu-backend.railway.app

# Mapbox token
REACT_APP_MAPBOX_TOKEN=pk.eyJ1IjoibWl1c3VhcmlvIiwiaSI6...
```

---

## 🗄️ PASO 3: Desplegar en Railway

### 3.1 Instalar Railway CLI

```bash
npm install -g @railway/cli
```

### 3.2 Login en Railway

```bash
railway login
```

### 3.3 Inicializar Proyecto

```bash
# En la raíz del proyecto
railway init
```

Esto creará un `railway.json` en la raíz.

### 3.4 Crear Servicios en Railway

```bash
# 1. Crear servicio de backend
cd backend
railway add

# 2. Agregar base de datos PostgreSQL
railway add postgresql
```

### 3.5 Configurar Variables de Entorno

**IMPORTANTE:** Railway puede configurar variables desde comando o desde el dashboard.

#### Desde Terminal:

```bash
# Backend - Variables de autenticación
railway variables set JWT_SECRET=tu_clave_secreta_super_segura
railway variables set JWT_EXPIRES_IN=24h

# Backend - APIs externas
railway variables set GOOGLE_MAPS_API_KEY=tu_google_key
railway variables set MAPBOX_API_KEY=tu_mapbox_key

# Backend - Environment
railway variables set NODE_ENV=production
railway variables set PORT=3000

# Las variables de PostgreSQL se configuran automáticamente
```

#### Desde Dashboard de Railway:

1. Ve a https://railway.app
2. Selecciona tu servicio
3. Ve a "Variables"
4. Agrega manualmente:

```env
JWT_SECRET=generar_con_openssl_rand_hex_32
JWT_EXPIRES_IN=24h
GOOGLE_MAPS_API_KEY=tu_key
MAPBOX_API_KEY=tu_key
NODE_ENV=production
PORT=3000
```

---

## 🌐 PASO 4: Desplegar Frontend Separado

### 4.1 Opción A: Servicio Separado en Railway

```bash
cd frontend
railway add

# Configurar variables
railway variables set REACT_APP_API_URL=https://tu-backend.railway.app
railway variables set REACT_APP_MAPBOX_TOKEN=tu_token

# Deploy
railway up
```

### 4.2 Opción B: Usar Vercel/Netlify para Frontend

Si prefieres, puedes desplegar solo el frontend en Vercel o Netlify:

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod

# Configurar variables de entorno en Vercel dashboard
```

---

## 📱 PASO 5: Actualizar App Móvil

### Actualizar `src/services/apiService.js`

```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL de tu backend en Railway
const API_URL = 'https://tu-backend.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000
});

// ... resto del código igual
```

---

## ✅ PASO 6: Verificar Despliegue

### 6.1 Health Check

```bash
# Backend
curl https://tu-backend.railway.app/health

# Debe responder:
# {
#   "status": "ok",
#   "database": "connected",
#   "timestamp": "..."
# }
```

### 6.2 Probar Endpoints

```bash
# Root endpoint
curl https://tu-backend.railway.app/

# API root
curl https://tu-backend.railway.app/api
```

### 6.3 Ver Logs en Tiempo Real

```bash
railway logs

# O en el dashboard de Railway
# Settings → Logs
```

---

## 🔗 PASO 7: Configurar Dominio Personalizado (Opcional)

### 7.1 Desde Railway Dashboard

1. Ve a tu servicio
2. Settings → Domains
3. Click "Generate Domain" (gratis)
4. O agrega dominio personalizado
5. Configura DNS según instrucciones

### 7.2 Ejemplo de Dominios

```
Backend: https://tracking-api.railway.app
Frontend: https://tracking-dashboard.railway.app
```

---

## 📊 MONITOREO Y MÉTRICAS

### Verificar en Railway Dashboard

1. **Deployments**: Ver historial de deployments
2. **Metrics**: CPU, RAM, Network
3. **Logs**: Ver logs en tiempo real
4. **Settings**: Variables de entorno

### CLI Útil

```bash
# Ver estado
railway status

# Ver logs
railway logs

# Ver variables
railway variables

# Reiniciar servicio
railway restart

# Ver URL pública
railway domain
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS COMUNES

### Error: "Cannot connect to database"

**Solución:**
```bash
# Verificar que las variables de PostgreSQL estén configuradas
railway variables

# Deben existir: PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE
```

### Error: "Port already in use"

**Solución:**
```javascript
// En server.js, usar solo:
const PORT = process.env.PORT || 3000;

// Railway asigna el puerto automáticamente
app.listen(PORT, '0.0.0.0', () => {
  // ...
});
```

### Error: "Build failed"

**Solución:**
- Verificar que `package.json` tenga scripts correctos
- Verificar que `engines.node` esté especificado
- Ver logs: `railway logs`

### Frontend no conecta a Backend

**Solución:**
1. Verificar variable `REACT_APP_API_URL` en Railway
2. Verificar CORS en backend
3. Verificar que el URL tenga `https://` completo

---

## 💰 COSTOS Y LÍMITES

### Plan Gratuito de Railway

- ✅ $5 créditos mensuales
- ✅ PostgreSQL incluido
- ✅ Domains gratuitos (`.railway.app`)
- ✅ Build automático desde Git
- ✅ Logs en tiempo real

**Suficiente para el proyecto académico.**

---

## 📝 CHECKLIST DE DESPLIEGUE

### Backend
- [ ] Código preparado para producción
- [ ] Variables de entorno configuradas
- [ ] Base de datos PostgreSQL agregada
- [ ] Health check funcionando
- [ ] API respondiendo correctamente
- [ ] Logs verificados

### Frontend
- [ ] Build funcionando
- [ ] Variables de entorno configuradas
- [ ] Conectando a backend correctamente
- [ ] Mapas cargando
- [ ] Desplegado y accesible

### App Móvil
- [ ] URL de API actualizada
- [ ] Conectando correctamente
- [ ] Permisos configurados
- [ ] Enviando ubicaciones

---

## 🎓 PARA LA DEMOSTRACIÓN

### URLs para Presentar

```
Backend API: https://tu-backend.railway.app
Dashboard: https://tu-frontend.railway.app
Health Check: https://tu-backend.railway.app/health
API Docs: Puedes crear con Swagger/OpenAPI
```

### Comandos para Mostrar

```bash
# Health check
curl https://tu-backend.railway.app/health

# Listar dispositivos (requiere auth)
curl -H "Authorization: Bearer TOKEN" \
  https://tu-backend.railway.app/api/devices

# Ver logs en tiempo real
railway logs -f
```

---

## 🚀 Despliegue Rápido (Comandos Completos)

```bash
# 1. Instalar CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Backend
cd backend
railway init
railway add postgresql
railway variables set JWT_SECRET=$(openssl rand -hex 32)
railway variables set JWT_EXPIRES_IN=24h
railway variables set MAPBOX_API_KEY=tu_key
railway up

# 4. Frontend (nuevo terminal)
cd ../frontend
railway init
railway variables set REACT_APP_API_URL=$(railway domain)
railway variables set REACT_APP_MAPBOX_TOKEN=tu_key
railway up

# 5. Obtener URLs
railway domain
```

---

## ✅ VERIFICACIÓN FINAL

```bash
# 1. Health check
curl https://tu-backend.railway.app/health

# 2. Test con Postman
# POST https://tu-backend.railway.app/api/auth/register
# POST https://tu-backend.railway.app/api/auth/login
# POST https://tu-backend.railway.app/api/locations

# 3. Verificar frontend
# Abrir: https://tu-frontend.railway.app

# 4. Probar app móvil
# Configurar API_URL
# Enviar ubicación
# Verificar en dashboard
```

---

## 🎉 LISTO!

**Tu sistema completo estará desplegado en Railway:**
- ✅ Backend funcionando
- ✅ Base de datos PostgreSQL
- ✅ Dashboard accesible
- ✅ HTTPS automático
- ✅ Despliegue automático desde Git
- ✅ Logs y monitoreo

**Perfecto para demostración académica** 🎓

