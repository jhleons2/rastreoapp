# 🔧 Cómo Completar el Código

## 📦 Lo que Ya Está Creado

✅ Estructura de carpetas del backend
✅ `package.json` con dependencias
✅ `server.js` básico funcionando
✅ Configuración de base de datos para Railway
✅ Health check endpoint
✅ Archivos `.gitignore` y `railway.json`

## 🎯 Próximos Pasos para Completar el Código

### 1️⃣ Crear Modelos de Base de Datos

Necesitas crear los modelos en `backend/src/models/`:

**User.js** - Para autenticación
```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  phone_number: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255)
  },
  password_hash: {
    type: DataTypes.STRING(255)
  }
});

module.exports = User;
```

**Device.js** - Para dispositivos
```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Device = sequelize.define('Device', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  device_name: {
    type: DataTypes.STRING(100)
  },
  device_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  last_seen: {
    type: DataTypes.DATE
  }
});

module.exports = Device;
```

**Location.js** - Para ubicaciones
```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Location = sequelize.define('Location', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  device_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  },
  accuracy: {
    type: DataTypes.DECIMAL(5, 2)
  },
  altitude: {
    type: DataTypes.DECIMAL(8, 2)
  },
  speed: {
    type: DataTypes.DECIMAL(5, 2)
  },
  heading: {
    type: DataTypes.DECIMAL(5, 2)
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Location;
```

### 2️⃣ Crear Middleware de Autenticación

En `backend/src/middleware/auth.js`:

```javascript
const jwt = require('jsonwebtoken');

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

### 3️⃣ Crear Controladores

**authController.js** - Para login/registro
**deviceController.js** - Para gestión de dispositivos
**locationController.js** - Para ubicaciones

Ver ejemplos en: `ARQUITECTURA_SISTEMA_RASTREO.md` (Fase 2)

### 4️⃣ Crear Rutas

**routes/auth.js** - Rutas de autenticación
**routes/devices.js** - Rutas de dispositivos
**routes/locations.js** - Rutas de ubicaciones

Y conectarlas en `server.js`:
```javascript
app.use('/api/auth', require('./routes/auth'));
app.use('/api/devices', require('./routes/devices'));
app.use('/api/locations', require('./routes/locations'));
```

### 5️⃣ Crear .env para Desarrollo Local

```bash
# En backend/
cp .env.example .env

# Editar .env con tus valores
NODE_ENV=development
PORT=3000
JWT_SECRET=tu_clave_secreta
DATABASE_URL=postgres://usuario:password@localhost:5432/tracking_db
```

## 📝 Crear Estructura de Base de Datos

Ver SQL en `GUIA_INSTALACION_IMPLEMENTACION.md` (líneas 80-150)

O simplemente usa Sequelize sync en desarrollo:

```javascript
// En server.js descomentar:
await sequelize.sync({ alter: false });
```

## 🚀 Próximos Pasos

1. Instalar dependencias: `npm install`
2. Crear modelos (copiar de la documentación)
3. Crear controladores
4. Crear rutas
5. Probar localmente: `npm run dev`
6. Desplegar en Railway: `railway up`

## 📚 Referencias

- Ejemplos completos en: `ARQUITECTURA_SISTEMA_RASTREO.md`
- Guía de implementación: `GUIA_INSTALACION_IMPLEMENTACION.md`
- Guía de despliegue: `GUIA_DESPLIEGUE_PASO_A_PASO.md`

## ⚡ Comando para Empezar

```bash
cd backend
npm install
npm run dev
```

Esto iniciará el servidor en `http://localhost:3000`
Health check: `http://localhost:3000/health`

