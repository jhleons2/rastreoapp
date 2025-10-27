# Arquitectura y Plan de Implementación: Sistema de Rastreo de Ubicación

## 1. Arquitectura General del Sistema

### 1.1 Diagrama de Arquitectura

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Aplicación    │◄────────┤   Frontend Web   │────────►│  Base de Datos  │
│   Móvil (iOS/   │         │   (Dashboard)    │         │   (PostgreSQL/  │
│   Android)      │         │   - Visualización│         │    MongoDB)      │
│                 │         │   - Historial    │         │                 │
└────────┬────────┘         └──────────────────┘         └─────────────────┘
         │                            ▲
         │                            │
         ▼                            │
┌─────────────────┐                   │
│   Backend API   │◄──────────────────┘
│   (Node.js/     │
│   Python)       │
│                 │
│  - Autenticación│
│  - Geolocalización│
│  - Notificaciones│
└─────────────────┘
```

### 1.2 Componentes Principales

1. **Aplicación Móvil**: Captura y envía la ubicación
2. **Backend API**: Procesa y almacena las ubicaciones
3. **Base de Datos**: Almacena ubicaciones, usuarios y configuración
4. **Frontend Web**: Dashboard para visualización
5. **Servicios Externos**: APIs de mapas (Google Maps, Mapbox)

---

## 2. Arquitectura Técnica Detallada

### 2.1 Stack Tecnológico Recomendado

#### Frontend Móvil (React Native / Flutter)
- **React Native** (recomendado para desarrollo multiplataforma)
  - Librerías: `react-native-geolocation`, `react-native-maps`
- **Flutter** (alternativa)
  - Librerías: `geolocator`, `google_maps_flutter`

#### Backend (Node.js con Express)
- **Node.js + Express**
  - Framework: Express.js
  - ORM: Sequelize (PostgreSQL) o Mongoose (MongoDB)
  - Autenticación: JWT + Passport.js
  - WebSocket: Socket.io (para actualizaciones en tiempo real)

#### Base de Datos
- **PostgreSQL** (recomendado para datos relacionales)
  - Tablas: users, devices, locations, geofences
- **MongoDB** (alternativa para escalabilidad)
  - Colecciones: users, locations

#### Frontend Web (React + TypeScript)
- **React** con TypeScript
- **Mapbox GL JS** o **Google Maps API**
- **Socket.io Client** (tiempo real)
- Framework CSS: **Tailwind CSS**

#### Servicios de Infraestructura
- **Docker** para contenedorización
- **Redis** para caché y sesiones
- **Nginx** como reverse proxy
- Cloud hosting: **AWS**, **Google Cloud** o **Heroku**

---

## 3. Plan de Implementación Paso a Paso

### FASE 1: Configuración del Proyecto (Semana 1)

#### Paso 1.1: Configurar Backend
```bash
# Inicializar proyecto Node.js
npm init -y
npm install express cors helmet morgan dotenv
npm install sequelize pg2
npm install jsonwebtoken bcryptjs
npm install socket.io
npm install nodemailer (para notificaciones)

# Estructura de carpetas
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Device.js
│   │   ├── Location.js
│   │   └── Geofence.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── locations.js
│   │   └── devices.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── locationController.js
│   │   └── deviceController.js
│   ├── utils/
│   │   ├── geofencing.js
│   │   └── notifications.js
│   └── server.js
```

#### Paso 1.2: Configurar Base de Datos
```sql
-- PostgreSQL Schema
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE devices (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    device_name VARCHAR(100),
    device_type VARCHAR(50), -- 'mobile', 'telegram_bot'
    is_active BOOLEAN DEFAULT true,
    last_seen TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES devices(id),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy DECIMAL(5, 2),
    altitude DECIMAL(8, 2),
    speed DECIMAL(5, 2),
    heading DECIMAL(5, 2),
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE geofences (
    id SERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES devices(id),
    name VARCHAR(100),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    radius DECIMAL(10, 2) NOT NULL, -- en metros
    notify_on_enter BOOLEAN DEFAULT false,
    notify_on_exit BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_locations_device_timestamp ON locations(device_id, timestamp);
CREATE INDEX idx_locations_timestamp ON locations(timestamp);
```

#### Paso 1.3: Variables de Entorno (.env)
```env
# Backend
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tracking_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# External APIs
GOOGLE_MAPS_API_KEY=your_google_maps_key
MAPBOX_API_KEY=your_mapbox_key

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Telegram Bot (opcional)
TELEGRAM_BOT_TOKEN=your_bot_token
```

---

### FASE 2: Implementación del Backend (Semana 2-3)

#### Paso 2.1: Modelos de Base de Datos
```javascript
// models/User.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
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

  User.associate = (models) => {
    User.hasMany(models.Device, { foreignKey: 'user_id' });
  };

  return User;
};
```

```javascript
// models/Device.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
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

  Device.associate = (models) => {
    Device.belongsTo(models.User, { foreignKey: 'user_id' });
    Device.hasMany(models.Location, { foreignKey: 'device_id' });
    Device.hasMany(models.Geofence, { foreignKey: 'device_id' });
  };

  return Device;
};
```

```javascript
// models/Location.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
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

  Location.associate = (models) => {
    Location.belongsTo(models.Device, { foreignKey: 'device_id' });
  };

  return Location;
};
```

#### Paso 2.2: Controladores
```javascript
// controllers/locationController.js
const { Location, Device } = require('../models');
const geofencingService = require('../utils/geofencing');

// Guardar ubicación
exports.createLocation = async (req, res) => {
  try {
    const { device_id, latitude, longitude, accuracy, altitude, speed, heading } = req.body;
    
    // Verificar que el dispositivo existe y pertenece al usuario
    const device = await Device.findOne({ 
      where: { id: device_id, user_id: req.user.id }
    });
    
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    // Crear nueva ubicación
    const location = await Location.create({
      device_id,
      latitude,
      longitude,
      accuracy,
      altitude,
      speed,
      heading
    });

    // Actualizar last_seen del dispositivo
    await device.update({ last_seen: new Date() });

    // Verificar geofences
    const geofences = await device.getGeofences();
    await geofencingService.checkGeofences(device, location, geofences);

    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener ubicaciones del dispositivo
exports.getLocations = async (req, res) => {
  try {
    const { device_id } = req.params;
    const { start_date, end_date, limit = 100 } = req.query;

    const where = { device_id };
    
    if (start_date && end_date) {
      where.timestamp = {
        [Op.between]: [start_date, end_date]
      };
    }

    const locations = await Location.findAll({
      where,
      order: [['timestamp', 'DESC']],
      limit: parseInt(limit)
    });

    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener ubicación actual
exports.getCurrentLocation = async (req, res) => {
  try {
    const { device_id } = req.params;

    const device = await Device.findOne({ 
      where: { id: device_id, user_id: req.user.id }
    });

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    const location = await Location.findOne({
      where: { device_id },
      order: [['timestamp', 'DESC']]
    });

    res.json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### Paso 2.3: Middleware de Autenticación
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

#### Paso 2.4: Rutas API
```javascript
// routes/locations.js
const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { authenticate } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authenticate);

router.post('/', locationController.createLocation);
router.get('/device/:device_id', locationController.getLocations);
router.get('/device/:device_id/current', locationController.getCurrentLocation);

module.exports = router;
```

---

### FASE 3: Aplicación Móvil (Semana 3-4)

#### Paso 3.1: Configuración React Native
```bash
# Instalar dependencias
npm install react-native-geolocation-service
npm install @react-native-community/geolocation
npm install @react-native-async-storage/async-storage
npm install axios
npm install react-native-maps
```

#### Paso 3.2: Servicio de Geolocalización
```javascript
// services/geolocationService.js
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, PermissionsAndroid } from 'react-native';
import axios from 'axios';

const API_URL = 'http://your-backend-url:3000/api';

class GeolocationService {
  constructor() {
    this.watchId = null;
    this.interval = null;
  }

  async requestPermissions() {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (error) => {
          reject(error);
        },
        {
          accuracy: {
            android: 'high',
            ios: 'best'
          },
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000
        }
      );
    });
  }

  watchPosition(callback) {
    this.watchId = Geolocation.watchPosition(
      (position) => {
        callback(position);
      },
      (error) => {
        console.error('WatchPosition error:', error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best'
        },
        enableHighAccuracy: true,
        distanceFilter: 10, // metros
        interval: 300000, // 5 minutos
        fastestInterval: 60000 // 1 minuto
      }
    );
  }

  async sendLocationToServer(location, deviceId, token) {
    try {
      const response = await axios.post(
        `${API_URL}/locations`,
        {
          device_id: deviceId,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
          altitude: location.coords.altitude,
          speed: location.coords.speed,
          heading: location.coords.heading
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending location:', error);
      throw error;
    }
  }

  startTracking(deviceId, token, interval = 600000) {
    this.interval = setInterval(async () => {
      try {
        const position = await this.getCurrentPosition();
        await this.sendLocationToServer(position, deviceId, token);
        console.log('Location sent:', position.coords);
      } catch (error) {
        console.error('Tracking error:', error);
      }
    }, interval);
  }

  stopTracking() {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

export default new GeolocationService();
```

#### Paso 3.3: Pantalla Principal de Tracking
```javascript
// screens/TrackingScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import GeolocationService from '../services/geolocationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker } from 'react-native-maps';

const TrackingScreen = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    loadUserData();
    requestPermissions();
  }, []);

  const loadUserData = async () => {
    const storedDeviceId = await AsyncStorage.getItem('device_id');
    const storedToken = await AsyncStorage.getItem('auth_token');
    setDeviceId(storedDeviceId);
    setToken(storedToken);
  };

  const requestPermissions = async () => {
    await GeolocationService.requestPermissions();
  };

  const startTracking = async () => {
    if (!deviceId || !token) {
      console.error('Device ID or Token not found');
      return;
    }

    setIsTracking(true);
    GeolocationService.startTracking(deviceId, token, 600000); // Cada 10 minutos

    // También watch para actualización en tiempo real
    GeolocationService.watchPosition((position) => {
      setCurrentLocation(position);
    });
  };

  const stopTracking = () => {
    setIsTracking(false);
    GeolocationService.stopTracking();
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: currentLocation?.coords?.latitude || 4.6097,
          longitude: currentLocation?.coords?.longitude || -74.0817,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude
            }}
            title="Tu ubicación"
          />
        )}
      </MapView>

      <View style={styles.controls}>
        <Text style={styles.status}>
          {isTracking ? 'Rastreando activo' : 'Rastreo detenido'}
        </Text>
        <Button
          title={isTracking ? 'Detener' : 'Iniciar'}
          onPress={isTracking ? stopTracking : startTracking}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
  controls: {
    padding: 20,
    backgroundColor: 'white'
  },
  status: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center'
  }
});

export default TrackingScreen;
```

---

### FASE 4: Bot de Telegram (Opcional) (Semana 4)

#### Paso 4.1: Implementar Bot
```javascript
// telegram-bot/index.js
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const API_URL = 'http://your-backend-url:3000/api';

// Comando /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Bienvenido al bot de rastreo. Envía tu ubicación usando el botón o /ubicacion');
});

// Solicitar ubicación con botones
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  if (msg.text === '/ubicacion') {
    const options = {
      reply_markup: JSON.stringify({
        keyboard: [
          [{ text: '📍 Compartir mi ubicación', request_location: true }]
        ],
        one_time_keyboard: true
      })
    };
    bot.sendMessage(chatId, 'Presiona el botón para compartir tu ubicación', options);
  }
});

// Recibir ubicación
bot.on('location', async (msg) => {
  const chatId = msg.chat.id;
  const location = msg.location;

  try {
    // Enviar ubicación al backend
    await axios.post(`${API_URL}/locations`, {
      device_id: chatId, // Usar chatId como device_id
      latitude: location.latitude,
      longitude: location.longitude,
      timestamp: new Date()
    });

    bot.sendMessage(chatId, 
      `Ubicación recibida: ${location.latitude}, ${location.longitude}`
    );
  } catch (error) {
    console.error('Error saving location:', error);
    bot.sendMessage(chatId, 'Error al guardar la ubicación');
  }
});
```

---

### FASE 5: Frontend Web Dashboard (Semana 5)

#### Paso 5.1: Configurar React + TypeScript
```bash
# Crear proyecto
npx create-react-app dashboard --template typescript
cd dashboard

# Instalar dependencias
npm install mapbox-gl socket.io-client axios
npm install @mapbox/mapbox-gl-geocoder
npm install recharts (para gráficos)
```

#### Paso 5.2: Componente de Mapa
```typescript
// components/LocationMap.tsx
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Location {
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface Props {
  locations: Location[];
}

const LocationMap: React.FC<Props> = ({ locations }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || '';

    map.current = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [locations[0]?.longitude || -74.0817, locations[0]?.latitude || 4.6097],
      zoom: 13
    });

    // Agregar marcadores
    locations.forEach(location => {
      new mapboxgl.Marker()
        .setLngLat([location.longitude, location.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(
          `<div>${new Date(location.timestamp).toLocaleString()}</div>`
        ))
        .addTo(map.current as mapboxgl.Map);
    });

    // Zoom para mostrar todas las ubicaciones
    if (locations.length > 0) {
      const bounds = locations.reduce((bounds, loc) => {
        return bounds.extend([loc.longitude, loc.latitude]);
      }, new mapboxgl.LngLatBounds(locations[0].longitude, locations[0].latitude));

      map.current.fitBounds(bounds, { padding: 50 });
    }

    return () => {
      map.current?.remove();
    };
  }, [locations]);

  return <div ref={mapRef} style={{ width: '100%', height: '500px' }} />;
};

export default LocationMap;
```

#### Paso 5.3: Dashboard Principal
```typescript
// components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import LocationMap from './LocationMap';
import { getDeviceLocations } from '../services/api';

interface Location {
  id: number;
  latitude: number;
  longitude: number;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDevice) {
      fetchLocations();
    }
  }, [selectedDevice]);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const data = await getDeviceLocations(selectedDevice);
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <h1>Dashboard de Rastreo</h1>

      <div className="controls">
        <select 
          value={selectedDevice} 
          onChange={(e) => setSelectedDevice(e.target.value)}
        >
          <option value="">Seleccionar dispositivo</option>
          {/* Cargar dispositivos desde API */}
        </select>
      </div>

      {loading ? (
        <div>Cargando...</div>
      ) : (
        <>
          <LocationMap locations={locations} />
          
          <div className="charts">
            <h2>Historial de Ubicaciones</h2>
            <LineChart width={800} height={300} data={locations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="latitude" stroke="#8884d8" />
              <Line type="monotone" dataKey="longitude" stroke="#82ca9d" />
            </LineChart>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
```

---

## 4. Características Avanzadas

### 4.1 Geofencing
```javascript
// utils/geofencing.js
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Radio de la Tierra en metros
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};

const checkGeofence = (location, geofence) => {
  const distance = calculateDistance(
    location.latitude,
    location.longitude,
    geofence.latitude,
    geofence.longitude
  );

  return {
    isInside: distance <= geofence.radius,
    distance: distance
  };
};

exports.checkGeofences = async (device, location, geofences) => {
  for (const geofence of geofences) {
    const result = checkGeofence(location, geofence);

    if (result.isInside && geofence.notify_on_enter) {
      // Notificar entrada
      await sendNotification(device.user_id, {
        type: 'geofence_enter',
        geofence_name: geofence.name,
        location: location
      });
    } else if (!result.isInside && geofence.notify_on_exit) {
      // Notificar salida
      await sendNotification(device.user_id, {
        type: 'geofence_exit',
        geofence_name: geofence.name,
        location: location
      });
    }
  }
};
```

### 4.2 WebSocket para Actualización en Tiempo Real
```javascript
// server.js
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('subscribe_device', (deviceId) => {
    socket.join(`device_${deviceId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// En el controlador, emitir evento
exports.createLocation = async (req, res) => {
  // ... código anterior ...
  
  // Emitir evento de nueva ubicación
  io.to(`device_${device_id}`).emit('new_location', location);
  
  res.status(201).json(location);
};
```

---

## 5. Seguridad y Privacidad

### 5.1 Medidas de Seguridad Implementadas

1. **Autenticación JWT**: Tokens seguros para acceso a la API
2. **HTTPS**: Comunicación encriptada entre cliente y servidor
3. **Autorización**: Usuarios solo pueden acceder a sus propios dispositivos
4. **Sanitización**: Validación de inputs para prevenir SQL injection
5. **Rate Limiting**: Limitar número de requests por usuario
6. **Geolocalización Opcional**: El usuario debe consentir explícitamente

### 5.2 Política de Privacidad

- **Consentimiento Explícito**: El usuario debe aceptar los términos
- **Datos Minimizados**: Solo se recolecta lo estrictamente necesario
- **Retención Limitada**: Definir período de retención de datos históricos
- **Derecho al Olvido**: Permitir eliminación de datos

---

## 6. Consideraciones Éticas

⚠️ **IMPORTANTE: Uso Ético del Sistema**

Este sistema está diseñado para uso ético y consensual:

1. ✅ **Solo rastreo con consentimiento**: El usuario debe instalar y activar la app voluntariamente
2. ✅ **Transparencia**: El usuario siempre sabe que está siendo rastreado
3. ✅ **Control del usuario**: El usuario puede detener el rastreo en cualquier momento
4. ✅ **Datos personales protegidos**: No se comparte ubicación con terceros
5. ✅ **Uso legítimo**: Para seguimiento familiar, laboral (con consentimiento) o personal

❌ **NO USAR PARA:**
- Espionaje
- Acoso o stalking
- Rastreo sin consentimiento
- Violación de privacidad

---

## 7. Próximos Pasos para el Desarrollo

1. ✅ Configurar repositorio Git
2. ✅ Configurar CI/CD (GitHub Actions o GitLab CI)
3. ✅ Implementar pruebas unitarias (Jest)
4. ✅ Configurar Docker y Docker Compose
5. ✅ Implementar logging (Winston)
6. ✅ Configurar monitoreo (Sentry, DataDog)
7. ✅ Desplegar en cloud (AWS, GCP, Azure)
8. ✅ Documentar API con Swagger/OpenAPI

---

## 8. Recursos y Referencias

- [React Native Geolocation Documentation](https://github.com/Agontuk/react-native-geolocation-service)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- [Socket.io Documentation](https://socket.io/docs/)
- [JWT Authentication](https://jwt.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Desarrollado con fines académicos y éticos**

