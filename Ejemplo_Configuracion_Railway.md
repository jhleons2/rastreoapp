# ⚡ Configuración Rápida para Railway

## 🎯 Resumen de Cambios Necesarios

Estos son los archivos mínimos que necesitas modificar para desplegar en Railway:

---

## 1. Archivo: `backend/.env.example`

Crea este archivo como plantilla (no subirlo a GitHub):

```env
# Railway configurará estas automáticamente
# No necesitas copiar/pegar nada, Railway las crea

# JWT - DEBES CONFIGURAR MANUALMENTE
JWT_SECRET=genera_un_secreto_seguro_con:openssl rand -hex 32
JWT_EXPIRES_IN=24h

# Backend
NODE_ENV=production
PORT=3000

# External APIs - DEBES CONFIGURAR MANUALMENTE
GOOGLE_MAPS_API_KEY=tu_key_de_google
MAPBOX_API_KEY=tu_key_de_mapbox
```

---

## 2. Archivo: `backend/src/config/database.js`

Código actualizado para Railway:

```javascript
const Sequelize = require('sequelize');
require('dotenv').config();

// Railway automáticamente proporciona DATABASE_URL
const databaseUrl = process.env.DATABASE_URL || 
  process.env.DB_URL ||
  `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

console.log('Connecting to database...');
console.log('Database URL:', databaseUrl.replace(/:[^:@]+@/, ':****@')); // Ocultar password

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  logging: (msg) => {
    // Solo mostrar queries en desarrollo
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

---

## 3. Archivo: `backend/src/server.js`

Ajustes para Railway:

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
  origin: process.env.FRONTEND_URL || true, // Permitir todos los orígenes en desarrollo
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HEALTH CHECK - Railway lo necesita
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ 
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      database: 'disconnected',
      error: error.message 
    });
  }
});

// Ruta principal
app.get('/', (req, res) => {
  res.json({ 
    message: 'Tracking API is running on Railway',
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
    path: req.originalUrl 
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
const startServer = async () => {
  try {
    console.log('Starting server...');
    console.log(`Environment: ${process.env.NODE_ENV}`);
    
    // Conectar a base de datos
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Sincronizar modelos (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('✅ Database models synchronized');
    }
    
    // Iniciar servidor
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Local: http://localhost:${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    });
    
  } catch (error) {
    console.error('❌ Unable to start server:', error.message);
    process.exit(1);
  }
};

// Manejo de cierre graceful
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing connections...');
  await sequelize.close();
  process.exit(0);
});

startServer();
```

---

## 4. Archivo: `backend/package.json`

Scripts configurados para Railway:

```json
{
  "name": "tracking-backend",
  "version": "1.0.0",
  "description": "Tracking system backend for academic purposes",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "railway": "npm start",
    "test": "echo \"No tests yet\" && exit 0"
  },
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  },
  "keywords": ["tracking", "geolocation", "api"],
  "author": "Your Name",
  "license": "MIT"
}
```

---

## 5. Archivo: `backend/.gitignore`

Asegúrate de tener:

```gitignore
# Environment
.env
.env.local
.env.*.local

# Logs
logs
*.log
npm-debug.log*

# Dependencies
node_modules/

# Build
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Railway
.railway/
```

---

## 6. Archivo: `railway.json` (Opcional)

Configuración específica de Railway:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## 🚀 Pasos para Desplegar (Resumen)

```bash
# 1. Inicia Railway
railway login

# 2. Crea proyecto
railway init

# 3. Crea base de datos
railway add postgres

# 4. Vincula repo
railway link

# 5. Configura variables
railway variables set JWT_SECRET=tu_secreto_seguro
railway variables set JWT_EXPIRES_IN=24h
railway variables set MAPBOX_API_KEY=tu_key

# 6. Deploy
railway up

# 7. Ver logs
railway logs

# 8. Obtener URL
railway domain
```

---

## ✅ Checklist Rápido

Antes de desplegar:

- [ ] Cambiar puerto a `process.env.PORT`
- [ ] Habilitar SSL para PostgreSQL
- [ ] Configurar variables de entorno en Railway
- [ ] Verificar que `.env` esté en `.gitignore`
- [ ] Probar endpoint `/health`
- [ ] Configurar CORS correctamente
- [ ] Verificar logs en Railway dashboard

---

## 🔗 URLs Después del Despliegue

Después de desplegar, tendrás:

- **API**: `https://tu-proyecto.railway.app`
- **Health Check**: `https://tu-proyecto.railway.app/health`
- **API Docs**: `https://tu-proyecto.railway.app/api`

Actualiza la app móvil con esta URL.

---

## 🎯 Ejemplo de Variables de Entorno en Railway

Copiar y pegar en el panel de Railway:

```env
# Autenticación
JWT_SECRET=generar_con_openssl_rand_hex_32
JWT_EXPIRES_IN=24h

# Backend
NODE_ENV=production

# APIs Externas
GOOGLE_MAPS_API_KEY=AIzaSy...
MAPBOX_API_KEY=pk.eyJ1...

# Frontend (para CORS)
FRONTEND_URL=https://tu-dashboard.railway.app
```

**NOTA**: Las variables de PostgreSQL (`DATABASE_URL`, `PGHOST`, etc.) se crean automáticamente al agregar PostgreSQL.

---

## 🧪 Probar Despliegue

```bash
# 1. Health check
curl https://tu-proyecto.railway.app/health

# 2. Test API
curl https://tu-proyecto.railway.app/

# 3. Verificar con Postman
GET https://tu-proyecto.railway.app/api/devices
```

---

**¡En menos de 10 minutos tu backend estará en producción!** 🚀

