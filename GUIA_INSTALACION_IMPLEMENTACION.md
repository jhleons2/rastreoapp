# Guía Paso a Paso: Instalación e Implementación

## 📋 Requisitos Previos

### Software Necesario
- **Node.js** (v16 o superior) - [Descargar](https://nodejs.org/)
- **PostgreSQL** (v12 o superior) - [Descargar](https://www.postgresql.org/download/)
- **Git** - [Descargar](https://git-scm.com/)
- **React Native CLI** - Para desarrollo móvil
- **Postman** o **Insomnia** - Para probar APIs
- **Editor de código**: VS Code recomendado

### Cuentas de Servicios Externos
- **Google Cloud Console**: Para obtener API Key de Google Maps (opcional)
- **Mapbox Account**: Para obtener API Key de Mapbox (alternativa)
- **Telegram Bot** (opcional): [@BotFather](https://t.me/botfather)

---

## 🚀 PASO 1: Configuración del Backend

### 1.1 Crear Proyecto

```bash
# Crear directorio del proyecto
mkdir tracking-system
cd tracking-system

# Crear estructura de carpetas para backend
mkdir backend
cd backend

# Inicializar proyecto Node.js
npm init -y
```

### 1.2 Instalar Dependencias

```bash
# Dependencias principales
npm install express cors helmet morgan dotenv

# Base de datos
npm install sequelize pg pg-hstore

# Autenticación
npm install jsonwebtoken bcryptjs

# WebSockets
npm install socket.io

# Validación
npm install express-validator

# Desarrollo
npm install --save-dev nodemon
```

### 1.3 Configurar Base de Datos PostgreSQL

```bash
# Crear base de datos
psql -U postgres

# En PostgreSQL:
CREATE DATABASE tracking_db;
CREATE USER tracking_user WITH PASSWORD 'tu_contraseña_segura';
GRANT ALL PRIVILEGES ON DATABASE tracking_db TO tracking_user;
\q
```

### 1.4 Configurar Variables de Entorno

Crear archivo `.env` en el directorio `backend/`:

```env
# Configuración del servidor
NODE_ENV=development
PORT=3000

# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tracking_db
DB_USER=tracking_user
DB_PASSWORD=tu_contraseña_segura

# JWT
JWT_SECRET=mi_clave_secreta_super_segura_cambiar_en_produccion
JWT_EXPIRES_IN=24h

# APIs externas
GOOGLE_MAPS_API_KEY=tu_api_key_de_google
MAPBOX_API_KEY=tu_api_key_de_mapbox

# Redis (opcional)
REDIS_HOST=localhost
REDIS_PORT=6379

# Telegram Bot (opcional)
TELEGRAM_BOT_TOKEN=tu_telegram_bot_token
```

### 1.5 Crear Estructura de Archivos

```bash
mkdir src
mkdir src/config
mkdir src/models
mkdir src/routes
mkdir src/controllers
mkdir src/middleware
mkdir src/utils

# Crear archivos base
touch src/config/database.js
touch src/models/index.js
touch src/middleware/auth.js
touch src/utils/geofencing.js
touch src/server.js
```

### 1.6 Implementar Código Base

**src/config/database.js**
```javascript
const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
```

**src/server.js**
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
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get('/', (req, res) => {
  res.json({ message: 'Tracking API is running' });
});

// Importar rutas
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/devices', require('./routes/devices'));
// app.use('/api/locations', require('./routes/locations'));

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
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to database:', error);
    process.exit(1);
  }
};

startServer();
```

### 1.7 Actualizar package.json

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

### 1.8 Iniciar Backend

```bash
npm run dev
```

Si todo está correcto, deberías ver:
```
Database connected successfully
Database models synchronized
Server running on port 3000
```

---

## 📱 PASO 2: Configuración de la Aplicación Móvil

### 2.1 Crear Proyecto React Native

```bash
# Volver al directorio raíz
cd ..

# Instalar React Native CLI
npm install -g react-native-cli

# Crear proyecto
npx react-native init TrackingApp
cd TrackingApp
```

### 2.2 Instalar Dependencias

```bash
# Geolocalización
npm install react-native-geolocation-service
npm install @react-native-community/geolocation

# Mapas
npm install react-native-maps

# HTTP Client
npm install axios

# Almacenamiento local
npm install @react-native-async-storage/async-storage

# Cámara (para escanear códigos QR, opcional)
npm install react-native-qrcode-scanner

# Notificaciones
npm install @react-native-community/push-notification-ios
npm install react-native-push-notification

# Para Android (configuración de permisos)
cd android
# Editar android/app/src/main/AndroidManifest.xml
```

### 2.3 Configurar Permisos Android

**android/app/src/main/AndroidManifest.xml**
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <!-- Permisos de ubicación -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
    
    <!-- Permisos de internet -->
    <uses-permission android:name="android.permission.INTERNET" />
    
    <!-- ... resto de la configuración ... -->
</manifest>
```

### 2.4 Configurar Permisos iOS

**ios/TrackingApp/Info.plist**
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Necesitamos tu ubicación para el rastreo.</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Necesitamos tu ubicación en segundo plano para el rastreo continuo.</string>
```

### 2.5 Crear Estructura de Servicios

```bash
mkdir src/services
mkdir src/screens
mkdir src/components
touch src/services/geolocationService.js
touch src/services/apiService.js
```

### 2.6 Crear Servicio de API

**src/services/apiService.js**
```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://tu-ip-local:3000/api'; // Cambiar por tu IP local o dominio

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000
});

// Interceptor para agregar token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Autenticación
  async login(phoneNumber, password) {
    const response = await api.post('/auth/login', { phoneNumber, password });
    return response.data;
  },
  
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  // Dispositivos
  async getDevices() {
    const response = await api.get('/devices');
    return response.data;
  },
  
  async createDevice(deviceData) {
    const response = await api.post('/devices', deviceData);
    return response.data;
  },
  
  // Ubicaciones
  async sendLocation(deviceId, locationData) {
    const response = await api.post('/locations', {
      device_id: deviceId,
      ...locationData
    });
    return response.data;
  },
  
  async getLocations(deviceId, params = {}) {
    const response = await api.get(`/locations/device/${deviceId}`, { params });
    return response.data;
  },
  
  async getCurrentLocation(deviceId) {
    const response = await api.get(`/locations/device/${deviceId}/current`);
    return response.data;
  }
};

export default apiService;
```

### 2.7 Ejecutar Aplicación

```bash
# Terminal 1: Metro Bundler
npm start

# Terminal 2: Android
npm run android

# O para iOS (solo en macOS)
npm run ios
```

---

## 🌐 PASO 3: Configuración del Dashboard Web

### 3.1 Crear Proyecto React

```bash
cd ..
npx create-react-app dashboard --template typescript
cd dashboard
```

### 3.2 Instalar Dependencias

```bash
npm install mapbox-gl
npm install @mapbox/mapbox-gl-geocoder
npm install socket.io-client
npm install axios
npm install recharts
npm install react-router-dom
npm install tailwindcss postcss autoprefixer
```

### 3.3 Configurar Tailwind CSS

```bash
npx tailwindcss init -p
```

**tailwind.config.js**
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**src/index.css**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3.4 Configurar Variables de Entorno

**Crear `.env`**
```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_MAPBOX_TOKEN=tu_token_de_mapbox
```

### 3.5 Iniciar Dashboard

```bash
npm start
```

---

## 🤖 PASO 4: Configuración del Bot de Telegram (Opcional)

### 4.1 Crear Bot con BotFather

1. Abre Telegram y busca [@BotFather](https://t.me/botfather)
2. Envía `/newbot`
3. Sigue las instrucciones para nombrar tu bot
4. Guarda el token que te proporciona

### 4.2 Crear Estructura del Bot

```bash
cd ..
mkdir telegram-bot
cd telegram-bot
npm init -y
```

### 4.3 Instalar Dependencias

```bash
npm install node-telegram-bot-api axios
```

### 4.4 Crear Bot

**index.js**
```javascript
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const API_URL = process.env.API_URL || 'http://localhost:3000/api';

// Comando /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 
    '🤖 Bot de Rastreo activado\n\n' +
    'Comandos disponibles:\n' +
    '/ubicacion - Envía tu ubicación actual'
  );
});

// Solicitar ubicación
bot.onText(/\/ubicacion/, (msg) => {
  const chatId = msg.chat.id;
  const options = {
    reply_markup: JSON.stringify({
      keyboard: [[{ text: '📍 Compartir ubicación', request_location: true }]],
      one_time_keyboard: true
    })
  };
  bot.sendMessage(chatId, 'Presiona el botón para compartir tu ubicación', options);
});

// Recibir ubicación
bot.on('location', async (msg) => {
  const chatId = msg.chat.id;
  const location = msg.location;

  try {
    const response = await axios.post(`${API_URL}/locations`, {
      device_id: `telegram_${chatId}`,
      latitude: location.latitude,
      longitude: location.longitude,
      timestamp: new Date()
    });

    bot.sendMessage(chatId, 
      `📍 Ubicación recibida\n` +
      `Latitud: ${location.latitude}\n` +
      `Longitud: ${location.longitude}`
    );
  } catch (error) {
    console.error('Error:', error);
    bot.sendMessage(chatId, '❌ Error al guardar la ubicación');
  }
});

console.log('Telegram bot is running...');
```

### 4.5 Ejecutar Bot

```bash
node index.js
```

---

## 🧪 PASO 5: Pruebas y Validación

### 5.1 Probar Backend con Postman

**Registro de Usuario**
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "phone_number": "+573001234567",
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Login**
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "phone_number": "+573001234567",
  "password": "password123"
}
```

**Crear Dispositivo**
```bash
POST http://localhost:3000/api/devices
Authorization: Bearer {token}
Content-Type: application/json

{
  "device_name": "Mi Celular",
  "device_type": "mobile"
}
```

**Enviar Ubicación**
```bash
POST http://localhost:3000/api/locations
Authorization: Bearer {token}
Content-Type: application/json

{
  "device_id": 1,
  "latitude": 4.6097102,
  "longitude": -74.0817472,
  "accuracy": 10.5,
  "timestamp": "2024-01-20T10:00:00Z"
}
```

### 5.2 Probar Aplicación Móvil

1. Ejecutar la app en tu dispositivo
2. Login con credenciales creadas
3. Permitir permisos de ubicación
4. Iniciar rastreo
5. Verificar que las ubicaciones se envían al servidor

### 5.3 Probar Dashboard Web

1. Abrir navegador en `http://localhost:3000`
2. Hacer login
3. Seleccionar dispositivo
4. Ver mapa con ubicaciones

### 5.4 Probar Bot de Telegram

1. Buscar tu bot en Telegram
2. Enviar `/start`
3. Enviar `/ubicacion`
4. Compartir ubicación
5. Verificar que se guarde en la base de datos

---

## 🐳 PASO 6: Dockerización (Opcional)

### 6.1 Crear Dockerfile para Backend

**backend/Dockerfile**
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### 6.2 Crear docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: tracking_db
      POSTGRES_USER: tracking_user
      POSTGRES_PASSWORD: tracking_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: tracking_db
      DB_USER: tracking_user
      DB_PASSWORD: tracking_password
    depends_on:
      - postgres

volumes:
  postgres_data:
```

### 6.3 Ejecutar con Docker

```bash
docker-compose up --build
```

---

## 📊 PASO 7: Monitoreo y Logs

### 7.1 Implementar Logging (Winston)

```bash
cd backend
npm install winston
```

**src/utils/logger.js**
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

---

## ⚠️ Consideraciones de Seguridad

### Checklist de Seguridad

- [ ] Cambiar JWT_SECRET en producción
- [ ] Habilitar HTTPS
- [ ] Implementar rate limiting
- [ ] Validar todos los inputs
- [ ] Implementar CSRF protection
- [ ] Usar variables de entorno para secretos
- [ ] Implementar logging de seguridad
- [ ] Configurar firewall
- [ ] Hacer backup de base de datos
- [ ] Implementar autenticación de 2 factores (2FA)

---

## 📝 Notas Finales

### URLs Importantes

- Backend API: `http://localhost:3000`
- Dashboard Web: `http://localhost:3001`
- Base de Datos: `localhost:5432`
- Swagger Docs: `http://localhost:3000/api-docs` (si lo implementas)

### Comandos Útiles

```bash
# Ver logs de backend
npm run dev

# Ver logs de base de datos
psql -U tracking_user -d tracking_db

# Ver dispositivos conectados
SELECT * FROM devices;

# Ver ubicaciones recientes
SELECT * FROM locations ORDER BY timestamp DESC LIMIT 10;
```

---

## 🆘 Solución de Problemas Comunes

### Error: "ECONNREFUSED"
- Verificar que PostgreSQL esté corriendo
- Verificar credenciales en `.env`

### Error: "Permission denied" en Android
- Verificar permisos en `AndroidManifest.xml`
- Reinstalar app

### Error: "API key not valid"
- Verificar que las API keys estén correctas
- Verificar que estén en `.env`

### No se envían ubicaciones
- Verificar permisos de ubicación en el dispositivo
- Verificar que el backend esté corriendo
- Verificar logs del servidor

---

## ✅ Checklist de Implementación

- [ ] Backend configurado y funcionando
- [ ] Base de datos creada y conectada
- [ ] API endpoints funcionando
- [ ] Aplicación móvil compilando y corriendo
- [ ] Permisos de ubicación configurados
- [ ] Dashboard web funcionando
- [ ] Integración con mapas funcionando
- [ ] Bot de Telegram funcionando (opcional)
- [ ] Autenticación implementada
- [ ] Pruebas realizadas
- [ ] Documentación completa

---

**¿Necesitas ayuda? Revisa los logs y consulta la documentación de cada tecnología utilizada.**

