# 🚂 Guía de Despliegue en Railway

## ¿Qué es Railway?

Railway es una plataforma de hosting en la nube que permite desplegar aplicaciones de forma simple usando Git. Es similar a Heroku pero con algunas ventajas adicionales:

- ✅ Despliegue automático desde GitHub
- ✅ Base de datos PostgreSQL incluida
- ✅ Sin configuración compleja
- ✅ Bandeja gratuita generosa
- ✅ Perfecto para proyectos académicos

---

## 🚀 Opción 1: Despliegue Rápido (Recomendado para Backend + Database)

### Paso 1: Crear Cuenta en Railway

1. Ve a [railway.app](https://railway.app)
2. Haz clic en "Login" → "Login with GitHub"
3. Autoriza Railway para acceder a tu repositorio

### Paso 2: Crear Nuevo Proyecto

1. En Railway, haz clic en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Conecta tu repositorio de GitHub
4. Selecciona la carpeta `backend/` como raíz del proyecto

### Paso 3: Configurar PostgreSQL

Railway tiene PostgreSQL integrado:

1. En tu proyecto Railway, haz clic en "New"
2. Selecciona "Database" → "PostgreSQL"
3. Railway automáticamente creará variables de entorno con la URL de conexión
4. Las variables se llaman: `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

### Paso 4: Configurar Variables de Entorno

En tu proyecto Railway, ve a "Variables" y agrega:

```env
# Auto-configurado por Railway PostgreSQL
# Estas variables se crean automáticamente:
# DATABASE_URL
# PGHOST
# PGPORT
# PGUSER
# PGPASSWORD
# PGDATABASE

# Backend
NODE_ENV=production
PORT=3000

# JWT (cambiar por una clave segura)
JWT_SECRET=tu_clave_secreta_super_segura_usar_nunca_en_produccion
JWT_EXPIRES_IN=24h

# APIs Externas
GOOGLE_MAPS_API_KEY=tu_google_maps_key
MAPBOX_API_KEY=tu_mapbox_key

# Redis (si lo necesitas, Railway también lo ofrece)
# REDIS_URL (se configura automáticamente si agregas Redis)
```

### Paso 5: Configurar package.json para Railway

**backend/package.json**
```json
{
  "name": "tracking-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "build": "echo 'No build step needed'",
    "railway": "npm start"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

### Paso 6: Ajustar Código para Railway

**src/config/database.js**
```javascript
const Sequelize = require('sequelize');
require('dotenv').config();

// Railway proporciona DATABASE_URL
const databaseUrl = process.env.DATABASE_URL || 
  `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  logging: console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;
```

### Paso 7: Desplegar

1. Haz commit y push a tu repositorio:
```bash
git add .
git commit -m "Configure for Railway deployment"
git push
```

2. Railway detectará los cambios y desplegará automáticamente
3. Verifica los logs en Railway dashboard
4. Obtén la URL pública de tu API (ej: `https://tu-proyecto.railway.app`)

---

## 🌐 Opción 2: Desplegar Dashboard Web en Railway

### Configuración para React

**dashboard/package.json**
```json
{
  "name": "tracking-dashboard",
  "version": "0.1.0",
  "scripts": {
    "start": "serve -s build",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "postinstall": "npm run build"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-scripts": "5.0.1"
  }
}
```

### Instalar Serve

```bash
cd dashboard
npm install --save-dev serve
```

### Configurar Variables de Entorno

En Railway dashboard, agrega:

```env
REACT_APP_API_URL=https://tu-backend.railway.app/api
REACT_APP_MAPBOX_TOKEN=tu_mapbox_token
```

### Desplegar

1. Crea un nuevo servicio en Railway
2. Conecta la carpeta `dashboard/`
3. Configura las variables de entorno
4. Railway ejecutará `npm install` y `npm run build`
5. La app quedará disponible en `https://tu-dashboard.railway.app`

---

## 📱 Opción 3: Actualizar App Móvil con URL de Railway

Una vez desplegado en Railway, necesitas actualizar la app móvil:

**src/services/apiService.js**
```javascript
import axios from 'axios';

// Cambiar esta URL por tu URL de Railway
const API_URL = 'https://tu-proyecto.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000
});

// ... resto del código
```

---

## 🔐 Configuración de Dominio Personalizado

1. En Railway, ve a tu servicio
2. Haz clic en "Settings"
3. En "Domains", agrega tu dominio personalizado
4. Configura DNS siguiendo las instrucciones de Railway

---

## 📊 Monitoreo y Logs

### Ver Logs en Tiempo Real

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Ver logs
railway logs
```

### Railway Dashboard

- Ve a [railway.app](https://railway.app)
- Selecciona tu proyecto
- Ve a "Deployments" para ver historial
- Ve a "Metrics" para ver recursos usados
- Ve a "Logs" para ver logs en tiempo real

---

## 💰 Plan Gratuito de Railway

El plan gratuito incluye:
- ✅ $5 créditos mensuales
- ✅ PostgreSQL incluido
- ✅ Despliegue ilimitado
- ✅ Domains personalizados
- ✅ SSL automático
- ✅ Perfecto para proyectos académicos

**Suficiente para desarrollar y probar el sistema completo.**

---

## 🎯 Checklist de Despliegue en Railway

### Backend
- [ ] Cuenta de Railway creada
- [ ] Proyecto creado en Railway
- [ ] Base de datos PostgreSQL agregada
- [ ] Variables de entorno configuradas
- [ ] Código adaptado para Railway
- [ ] Repositorio conectado
- [ ] Despliegue exitoso
- [ ] URL de API verificada

### Dashboard Web
- [ ] Servicio de dashboard creado
- [ ] Variables de entorno configuradas
- [ ] Build exitoso
- [ ] Dashboard accesible

### App Móvil
- [ ] URL de API actualizada
- [ ] Conectividad verificada
- [ ] Ubicaciones enviándose correctamente

---

## 🐛 Solución de Problemas Comunes

### Problema: Error de conexión a base de datos

**Solución**: Verificar que `DATABASE_URL` esté configurada correctamente y que el SSL esté habilitado:
```javascript
dialectOptions: {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
}
```

### Problema: Build falla

**Solución**: Verificar que `package.json` tenga scripts correctos y que `engines.node` esté configurado.

### Problema: Variables de entorno no funcionan

**Solución**: Asegurarse de que las variables estén en el panel de Railway, no en archivo `.env` del repositorio.

### Problema: Puerto no disponible

**Solución**: Railway asigna el puerto automáticamente, usar `process.env.PORT`:
```javascript
const PORT = process.env.PORT || 3000;
```

---

## 🔄 CI/CD Automático

Railway soporta despliegue automático desde Git:

1. Cada push a `main` despliega automáticamente
2. Puedes crear branches para staging
3. Deployments manuales también disponibles

---

## 📈 Escalado

Si necesitas más recursos:

1. Ve a "Settings" en tu servicio
2. Ajusta el plan según necesidades
3. Railway escalará automáticamente

---

## 🎓 Ventajas para Proyecto Académico

✅ **Sin configuración compleja** - Funciona de inmediato
✅ **Gratis** - Suficiente crédito mensual
✅ **PostgreSQL incluido** - No necesitas instalar nada
✅ **SSL automático** - HTTPS sin configuración
✅ **Logs integrados** - Fácil debugging
✅ **Deploy automático** - Solo hace push
✅ **Perfecto para demo** - URL pública inmediata

---

## 🔗 URLs Importantes

- **Railway**: https://railway.app
- **Documentación**: https://docs.railway.app
- **Estado del Servicio**: https://status.railway.app

---

## 📝 Ejemplo Completo: Código Adaptado para Railway

**src/server.js (completo)**
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const sequelize = require('./config/database');

const app = express();
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

// Health check (importante para Railway)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Rutas
app.get('/', (req, res) => {
  res.json({ 
    message: 'Tracking API is running',
    env: process.env.NODE_ENV
  });
});

// Importar rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/devices', require('./routes/devices'));
app.use('/api/locations', require('./routes/locations'));

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Iniciar servidor
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    // Sincronizar modelos (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('Database models synchronized');
    }
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Unable to connect to database:', error);
    process.exit(1);
  }
};

startServer();
```

---

## ✅ Pasos Finales

1. **Test de API**: Usar Postman para probar endpoints
2. **Verificar logs**: Revisar Railway dashboard
3. **Probar app móvil**: Conectar con URL de Railway
4. **Documentar**: Guardar URLs de producción

---

**¡Listo! Tu sistema estará desplegado en Railway en minutos** 🚂✨

