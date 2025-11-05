# 🏗️ Arquitectura del Sistema de Rastreo Geográfico

## Visión General

El sistema está compuesto por tres componentes principales que se comunican mediante una API REST:

1. **Aplicación Móvil Android** (React Native)
2. **Backend API** (Node.js + Express + PostgreSQL)
3. **Frontend Web** (React + Vite)

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                      USUARIO FINAL                          │
└──────────┬───────────────────────────┬──────────────────────┘
           │                           │
           ↓                           ↓
┌──────────────────┐         ┌─────────────────────┐
│  Aplicación      │         │   Panel Web         │
│  Móvil Android   │         │   (Frontend)        │
│                  │         │                     │
│  - React Native  │         │  - React 18         │
│  - Expo          │         │  - Leaflet Maps     │
│  - GPS API       │         │  - Tailwind CSS     │
│  - AsyncStorage  │         │  - React Router     │
└────────┬─────────┘         └──────────┬──────────┘
         │                              │
         │  POST /api/locations         │  GET /api/locations
         │  (cada 1 minuto)            │  (cada 30 segundos)
         │                              │
         └──────────┬───────────────────┘
                    │
                    ↓
         ┌─────────────────────┐
         │   BACKEND API       │
         │   (Node.js)         │
         │                     │
         │  - Express.js       │
         │  - JWT Auth         │
         │  - Sequelize ORM    │
         │  - Validación       │
         └─────────┬───────────┘
                   │
         ┌─────────┴─────────┬──────────────────┐
         │                   │                  │
         ↓                   ↓                  ↓
┌─────────────────┐  ┌──────────────┐  ┌────────────────┐
│   PostgreSQL    │  │  Telegram    │  │  Nominatim     │
│   Database      │  │  Bot API     │  │  Geocoding     │
│                 │  │              │  │  (OSM)         │
│  - Locations    │  │  - Notif.    │  │  - Dirección   │
│  - Devices      │  │  - Compartir │  │  - Inversa     │
│  - Users        │  │  - Alertas   │  │                │
│  - Geofences    │  │              │  │                │
└─────────────────┘  └──────────────┘  └────────────────┘
```

## Componentes Detallados

### 1. Aplicación Móvil (Mobile App)

**Ubicación**: `/mobile/`

**Responsabilidades**:
- Capturar coordenadas GPS del dispositivo
- Enviar ubicaciones al backend cada intervalo configurado
- Gestionar autenticación del usuario
- Mantener sesión persistente
- Mostrar estado de rastreo

**Stack Tecnológico**:
```javascript
{
  "framework": "React Native",
  "buildTool": "Expo",
  "gps": "expo-location",
  "http": "axios",
  "storage": "@react-native-async-storage/async-storage"
}
```

**Flujo de Captura GPS**:
```
1. Usuario inicia rastreo
2. App solicita permisos GPS
3. Se obtiene ubicación actual (getCurrentPositionAsync)
4. Se envía a API: POST /api/locations
5. Timer ejecuta cada 1 minuto
6. Repetir desde paso 3
```

**Estructura de Archivos**:
```
mobile/
├── src/
│   ├── config/
│   │   └── api.js          # Configuración Axios + Base URL
│   ├── screens/
│   │   ├── LoginScreen.js  # Pantalla de login
│   │   ├── RegisterScreen.js
│   │   └── TrackingScreen.js # Pantalla principal de rastreo
│   └── services/
│       └── LocationService.js # Lógica de GPS
├── android/                # Proyecto Android nativo
└── App.js                  # Punto de entrada
```

### 2. Backend API

**Ubicación**: `/backend/`

**Responsabilidades**:
- Autenticación y autorización (JWT)
- CRUD de dispositivos, ubicaciones, geocercas
- Validación de datos
- Geocodificación inversa
- Integración con Telegram Bot
- Manejo de errores

**Stack Tecnológico**:
```javascript
{
  "runtime": "Node.js 18+",
  "framework": "Express.js",
  "database": "PostgreSQL 14+",
  "orm": "Sequelize",
  "auth": "jsonwebtoken + bcrypt",
  "validation": "express-validator"
}
```

**Estructura de Archivos**:
```
backend/
├── src/
│   ├── server.js           # Punto de entrada
│   ├── config/
│   │   └── database.js     # Configuración Sequelize
│   ├── models/
│   │   ├── User.js         # Modelo de usuarios
│   │   ├── Device.js       # Modelo de dispositivos
│   │   ├── Location.js     # Modelo de ubicaciones
│   │   ├── Geofence.js     # Modelo de geocercas
│   │   └── index.js        # Exporta modelos + relaciones
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── deviceController.js
│   │   ├── locationController.js
│   │   ├── geofenceController.js
│   │   └── statsController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── devices.js
│   │   ├── locations.js
│   │   ├── geofences.js
│   │   ├── botRoutes.js
│   │   └── stats.js
│   ├── middleware/
│   │   ├── auth.js         # Verificación JWT
│   │   └── validation.js   # Validadores
│   ├── validators/
│   │   ├── authValidator.js
│   │   ├── deviceValidator.js
│   │   └── locationValidator.js
│   ├── utils/
│   │   ├── geocoding.js    # Geocodificación inversa
│   │   └── geofencing.js   # Lógica de geocercas
│   └── bot/
│       ├── telegramBot.js  # Bot de Telegram
│       └── whatsappBot.js  # Bot de WhatsApp (futuro)
└── package.json
```

### 3. Frontend Web

**Ubicación**: `/frontend/`

**Responsabilidades**:
- Dashboard con estadísticas
- Visualización de ubicaciones en mapa
- Gestión de dispositivos
- Configuración de geocercas
- Interfaz de usuario responsive

**Stack Tecnológico**:
```javascript
{
  "framework": "React 18",
  "buildTool": "Vite",
  "routing": "react-router-dom",
  "maps": "react-leaflet + leaflet",
  "styling": "Tailwind CSS",
  "notifications": "react-hot-toast",
  "icons": "lucide-react"
}
```

**Estructura de Archivos**:
```
frontend/
├── src/
│   ├── main.jsx            # Punto de entrada
│   ├── App.jsx             # Router principal
│   ├── pages/
│   │   ├── Login.jsx       # Página de login
│   │   ├── Register.jsx    # Página de registro
│   │   ├── Dashboard.jsx   # Dashboard principal
│   │   ├── Locations.jsx   # Mapa de ubicaciones
│   │   ├── Devices.jsx     # Gestión de dispositivos
│   │   ├── ShareLocation.jsx
│   │   └── TrackingMethods.jsx
│   ├── components/
│   │   └── Layout.jsx      # Layout con navegación
│   └── styles/
│       └── index.css       # Estilos globales + Tailwind
├── index.html
└── package.json
```

## Modelo de Datos

### Esquema de Base de Datos

```sql
-- Tabla de usuarios
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de dispositivos
CREATE TABLE devices (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  device_name VARCHAR(100),
  device_type VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_seen TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de ubicaciones
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  device_id INTEGER REFERENCES devices(id) ON DELETE CASCADE,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  accuracy DECIMAL(5,2),
  altitude DECIMAL(8,2),
  speed DECIMAL(5,2),
  heading DECIMAL(5,2),
  address TEXT,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de geocercas
CREATE TABLE geofences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  radius DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Relaciones

```
users (1) ────┬───── (N) devices
              └───── (N) geofences

devices (1) ───── (N) locations
```

## Flujo de Autenticación

```
┌────────────┐                    ┌──────────┐
│  Cliente   │                    │ Backend  │
└──────┬─────┘                    └────┬─────┘
       │                               │
       │  POST /api/auth/register      │
       │  { email, password }          │
       ├──────────────────────────────>│
       │                               │
       │  { user, token }              │
       │<──────────────────────────────┤
       │                               │
       │  (Guardar token en storage)   │
       │                               │
       │  POST /api/locations          │
       │  Header: Authorization: Bearer TOKEN
       ├──────────────────────────────>│
       │                               │
       │  (Verificar JWT)              │
       │                               │
       │  { location created }         │
       │<──────────────────────────────┤
       │                               │
```

## Seguridad

### Autenticación JWT

1. Usuario hace login → Backend genera JWT
2. JWT contiene: `{ id, email, iat, exp }`
3. Cliente guarda JWT en:
   - **Móvil**: AsyncStorage
   - **Web**: localStorage
4. Cada petición incluye: `Authorization: Bearer <token>`
5. Middleware verifica y decodifica JWT
6. Si válido, `req.user` contiene datos del usuario

### Encriptación de Contraseñas

```javascript
// Registro
const hashedPassword = await bcrypt.hash(password, 10);

// Login
const isValid = await bcrypt.compare(password, user.password);
```

### Validación de Datos

```javascript
// Ejemplo: Validar creación de ubicación
validateCreateLocation: [
  body('device_id').isInt().withMessage('Device ID must be integer'),
  body('latitude').isFloat({ min: -90, max: 90 }),
  body('longitude').isFloat({ min: -180, max: 180 }),
  body('accuracy').optional().isFloat({ min: 0 })
]
```

## APIs Externas

### 1. OpenStreetMap Nominatim (Geocodificación)

**Uso**: Convertir coordenadas a direcciones legibles

```javascript
// Ejemplo
const address = await reverseGeocode(4.123456, -74.123456);
// → "Carrera 7 #12-34, Bogotá, Colombia"
```

**Rate Limiting**: 1 request/segundo (configurable con API key)

### 2. Telegram Bot API

**Uso**: Enviar notificaciones y compartir ubicaciones

```javascript
bot.sendMessage(chatId, `Nueva ubicación: ${lat}, ${lon}`);
bot.sendLocation(chatId, lat, lon);
```

## Despliegue en Railway

```
┌─────────────────────────────────────────────────┐
│              Railway Platform                   │
│                                                 │
│  ┌───────────────┐  ┌──────────────┐          │
│  │  Backend      │  │  Frontend    │          │
│  │  (Node.js)    │  │  (Static)    │          │
│  │  Port: 3000   │  │  Vite Build  │          │
│  └───────┬───────┘  └──────────────┘          │
│          │                                      │
│          ↓                                      │
│  ┌───────────────┐                             │
│  │  PostgreSQL   │                             │
│  │  Database     │                             │
│  └───────────────┘                             │
│                                                 │
│  Variables de Entorno:                         │
│  - DATABASE_URL (auto-generada)               │
│  - JWT_SECRET                                  │
│  - TELEGRAM_BOT_TOKEN                          │
└─────────────────────────────────────────────────┘
```

## Optimizaciones

### Backend

- **Conexión a BD**: Pool de conexiones de Sequelize
- **Logging**: Morgan en modo 'dev' solo en desarrollo
- **CORS**: Configurado solo para orígenes permitidos
- **Compresión**: Helmet para headers de seguridad

### Frontend

- **Code Splitting**: Lazy loading de rutas con React Router
- **Imágenes**: Optimización con Vite
- **CSS**: Purge de Tailwind en producción
- **Caching**: Service Workers (futuro)

### Móvil

- **Build**: Modo release con optimizaciones de Gradle
- **ProGuard**: Minificación de código Android
- **Bundle**: Hermes engine para JavaScript optimizado

## Escalabilidad

### Horizontal Scaling

El sistema está diseñado para escalar horizontalmente:

1. **Backend sin estado**: JWT stateless permite múltiples instancias
2. **Base de datos**: PostgreSQL soporta read replicas
3. **CDN**: Assets estáticos pueden servirse desde CDN

### Límites Actuales

- **Ubicaciones por dispositivo**: Ilimitado (limitado por storage)
- **Dispositivos por usuario**: Ilimitado
- **Frecuencia de envío**: 1 minuto mínimo recomendado
- **Usuarios simultáneos**: ~1000 (con infraestructura actual)

## Monitoreo

### Health Check

```bash
GET /health
```

Respuesta:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-11-05T10:00:00.000Z"
}
```

### Logs

- **Backend**: Console logs + Railway logs dashboard
- **Frontend**: Browser console + Sentry (futuro)
- **Móvil**: React Native Debugger + Flipper

## Próximas Mejoras

1. **WebSockets**: Actualizaciones en tiempo real sin polling
2. **Redis**: Cache para consultas frecuentes
3. **Elasticsearch**: Búsqueda avanzada de ubicaciones
4. **Docker**: Containerización para desarrollo
5. **CI/CD**: GitHub Actions para testing automático
6. **Monitoreo**: Prometheus + Grafana

---

**Última actualización**: Noviembre 2025

