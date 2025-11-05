# 🔌 API Reference - Sistema de Rastreo Geográfico

Documentación completa de la API REST del sistema de rastreo.

## 📋 Información General

- **Base URL**: `https://rastreoapp-production.up.railway.app/api`
- **Protocolo**: HTTPS
- **Formato**: JSON
- **Autenticación**: JWT Bearer Token
- **Versión**: 1.0.0

## 🔐 Autenticación

Todas las rutas (excepto `/auth/register` y `/auth/login`) requieren autenticación JWT.

### Header de Autenticación

```http
Authorization: Bearer <tu_token_jwt>
```

### Obtener Token

**POST** `/api/auth/register` o `/api/auth/login`

Respuesta incluye:
```json
{
  "user": { "id": 1, "email": "user@example.com" },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 📍 Endpoints

### Autenticación

#### Registrar Usuario

```http
POST /api/auth/register
```

**Body**:
```json
{
  "email": "usuario@example.com",
  "password": "password123",
  "name": "Juan Pérez"
}
```

**Respuesta Exitosa** (201):
```json
{
  "user": {
    "id": 1,
    "email": "usuario@example.com",
    "name": "Juan Pérez",
    "created_at": "2025-11-05T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores**:
- `400`: Email ya existe
- `400`: Datos inválidos

---

#### Iniciar Sesión

```http
POST /api/auth/login
```

**Body**:
```json
{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Respuesta Exitosa** (200):
```json
{
  "user": {
    "id": 1,
    "email": "usuario@example.com",
    "name": "Juan Pérez"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores**:
- `401`: Credenciales inválidas
- `400`: Datos faltantes

---

### Dispositivos

#### Listar Dispositivos

```http
GET /api/devices
```

**Headers**:
```
Authorization: Bearer <token>
```

**Respuesta Exitosa** (200):
```json
[
  {
    "id": 1,
    "user_id": 1,
    "device_name": "Mi Teléfono",
    "device_type": "mobile",
    "is_active": true,
    "last_seen": "2025-11-05T10:30:00.000Z",
    "created_at": "2025-11-01T08:00:00.000Z",
    "updated_at": "2025-11-05T10:30:00.000Z"
  }
]
```

---

#### Obtener Dispositivo

```http
GET /api/devices/:id
```

**Parámetros**:
- `id` (integer): ID del dispositivo

**Respuesta Exitosa** (200):
```json
{
  "id": 1,
  "user_id": 1,
  "device_name": "Mi Teléfono",
  "device_type": "mobile",
  "is_active": true,
  "last_seen": "2025-11-05T10:30:00.000Z"
}
```

**Errores**:
- `404`: Dispositivo no encontrado
- `403`: No autorizado

---

#### Crear Dispositivo

```http
POST /api/devices
```

**Body**:
```json
{
  "device_name": "Nuevo Dispositivo",
  "device_type": "mobile"
}
```

**Respuesta Exitosa** (201):
```json
{
  "id": 2,
  "user_id": 1,
  "device_name": "Nuevo Dispositivo",
  "device_type": "mobile",
  "is_active": true,
  "created_at": "2025-11-05T10:35:00.000Z"
}
```

---

#### Actualizar Dispositivo

```http
PUT /api/devices/:id
```

**Body**:
```json
{
  "device_name": "Nombre Actualizado",
  "is_active": false
}
```

**Respuesta Exitosa** (200):
```json
{
  "id": 1,
  "device_name": "Nombre Actualizado",
  "is_active": false,
  "updated_at": "2025-11-05T10:40:00.000Z"
}
```

---

#### Eliminar Dispositivo

```http
DELETE /api/devices/:id
```

**Respuesta Exitosa** (200):
```json
{
  "message": "Device deleted successfully"
}
```

---

### Ubicaciones

#### Crear Ubicación

```http
POST /api/locations
```

**Body**:
```json
{
  "device_id": 1,
  "latitude": 4.123456,
  "longitude": -74.123456,
  "accuracy": 15.5,
  "altitude": 2640.0,
  "speed": 0.0,
  "heading": 0.0
}
```

**Campos**:
- `device_id` (integer, requerido): ID del dispositivo
- `latitude` (float, requerido): Latitud (-90 a 90)
- `longitude` (float, requerido): Longitud (-180 a 180)
- `accuracy` (float, opcional): Precisión en metros
- `altitude` (float, opcional): Altitud en metros
- `speed` (float, opcional): Velocidad en m/s
- `heading` (float, opcional): Dirección en grados (0-360)

**Respuesta Exitosa** (201):
```json
{
  "id": 1,
  "device_id": 1,
  "latitude": "4.12345600",
  "longitude": "-74.12345600",
  "accuracy": "15.50",
  "altitude": "2640.00",
  "speed": "0.00",
  "heading": "0.00",
  "address": "Carrera 7 #12-34, Bogotá, Colombia",
  "timestamp": "2025-11-05T10:45:00.000Z"
}
```

**Errores**:
- `400`: Datos inválidos
- `404`: Dispositivo no encontrado
- `403`: Dispositivo no pertenece al usuario

---

#### Listar Ubicaciones de Dispositivo

```http
GET /api/locations/device/:device_id
```

**Parámetros**:
- `device_id` (integer): ID del dispositivo

**Query Params** (opcionales):
- `limit` (integer): Número máximo de resultados (default: 100)
- `start_date` (ISO 8601): Fecha inicial
- `end_date` (ISO 8601): Fecha final

**Ejemplo**:
```
GET /api/locations/device/1?limit=50&start_date=2025-11-01&end_date=2025-11-05
```

**Respuesta Exitosa** (200):
```json
[
  {
    "id": 150,
    "device_id": 1,
    "latitude": "4.12345600",
    "longitude": "-74.12345600",
    "accuracy": "15.50",
    "altitude": "2640.00",
    "speed": "0.00",
    "heading": "0.00",
    "address": "Carrera 7 #12-34, Bogotá, Colombia",
    "timestamp": "2025-11-05T10:45:00.000Z"
  },
  {
    "id": 149,
    "device_id": 1,
    "latitude": "4.12340000",
    "longitude": "-74.12340000",
    "timestamp": "2025-11-05T10:44:00.000Z"
  }
]
```

---

#### Obtener Ubicación Actual

```http
GET /api/locations/device/:device_id/current
```

**Respuesta Exitosa** (200):
```json
{
  "id": 150,
  "device_id": 1,
  "latitude": "4.12345600",
  "longitude": "-74.12345600",
  "accuracy": "15.50",
  "timestamp": "2025-11-05T10:45:00.000Z"
}
```

---

### Geocercas

#### Listar Geocercas

```http
GET /api/geofences
```

**Respuesta Exitosa** (200):
```json
[
  {
    "id": 1,
    "user_id": 1,
    "name": "Casa",
    "latitude": "4.12345600",
    "longitude": "-74.12345600",
    "radius": "100.00",
    "is_active": true,
    "created_at": "2025-11-01T08:00:00.000Z"
  }
]
```

---

#### Crear Geocerca

```http
POST /api/geofences
```

**Body**:
```json
{
  "name": "Oficina",
  "latitude": 4.654321,
  "longitude": -74.654321,
  "radius": 150.0
}
```

**Respuesta Exitosa** (201):
```json
{
  "id": 2,
  "user_id": 1,
  "name": "Oficina",
  "latitude": "4.65432100",
  "longitude": "-74.65432100",
  "radius": "150.00",
  "is_active": true,
  "created_at": "2025-11-05T10:50:00.000Z"
}
```

---

#### Actualizar Geocerca

```http
PUT /api/geofences/:id
```

**Body**:
```json
{
  "name": "Oficina Principal",
  "radius": 200.0,
  "is_active": true
}
```

---

#### Eliminar Geocerca

```http
DELETE /api/geofences/:id
```

**Respuesta Exitosa** (200):
```json
{
  "message": "Geofence deleted successfully"
}
```

---

#### Verificar Geocercas

```http
POST /api/geofences/check
```

**Body**:
```json
{
  "device_id": 1,
  "latitude": 4.123456,
  "longitude": -74.123456
}
```

**Respuesta Exitosa** (200):
```json
{
  "inside": [
    {
      "id": 1,
      "name": "Casa",
      "distance": 45.2
    }
  ],
  "outside": [
    {
      "id": 2,
      "name": "Oficina",
      "distance": 523.8
    }
  ]
}
```

---

### Estadísticas

#### Obtener Estadísticas Generales

```http
GET /api/stats
```

**Respuesta Exitosa** (200):
```json
{
  "total_devices": 3,
  "active_devices": 2,
  "total_locations": 1523,
  "total_geofences": 5,
  "locations_today": 45,
  "locations_this_week": 312,
  "locations_this_month": 1203
}
```

---

#### Estadísticas de Dispositivo

```http
GET /api/stats/device/:device_id
```

**Respuesta Exitosa** (200):
```json
{
  "device_id": 1,
  "total_locations": 523,
  "first_location": "2025-10-15T08:00:00.000Z",
  "last_location": "2025-11-05T10:45:00.000Z",
  "average_accuracy": 12.5,
  "total_distance": 125.3,
  "locations_by_day": [
    { "date": "2025-11-05", "count": 45 },
    { "date": "2025-11-04", "count": 67 }
  ]
}
```

---

### Compartir Ubicación

#### Generar Link de Compartir

```http
POST /api/share/generate
```

**Body**:
```json
{
  "device_id": 1,
  "duration": 3600
}
```

**Campos**:
- `device_id`: ID del dispositivo
- `duration`: Duración del link en segundos (default: 3600 = 1 hora)

**Respuesta Exitosa** (201):
```json
{
  "share_link": "https://rastreoapp.com/share/abc123def456",
  "expires_at": "2025-11-05T11:45:00.000Z"
}
```

---

#### Compartir por Telegram

```http
POST /api/share/telegram
```

**Body**:
```json
{
  "device_id": 1,
  "chat_id": "123456789"
}
```

---

### Bot

#### Vincular Telegram

```http
POST /api/bots/telegram/link
```

**Body**:
```json
{
  "telegram_chat_id": "123456789",
  "telegram_username": "@usuario"
}
```

---

## 🔒 Códigos de Estado HTTP

| Código | Significado |
|--------|------------|
| 200 | OK - Éxito |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - No autorizado |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

## ❌ Formato de Errores

```json
{
  "error": "Descripción del error",
  "message": "Mensaje detallado",
  "details": { /* Información adicional */ }
}
```

## 📝 Ejemplos de Uso

### cURL

```bash
# Registro
curl -X POST https://rastreoapp-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Crear ubicación
curl -X POST https://rastreoapp-production.up.railway.app/api/locations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "device_id": 1,
    "latitude": 4.123456,
    "longitude": -74.123456,
    "accuracy": 15.5
  }'
```

### JavaScript (Fetch)

```javascript
// Registro
const response = await fetch('https://rastreoapp-production.up.railway.app/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'test@test.com',
    password: '123456'
  })
});

const data = await response.json();
const token = data.token;

// Crear ubicación
await fetch('https://rastreoapp-production.up.railway.app/api/locations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    device_id: 1,
    latitude: 4.123456,
    longitude: -74.123456,
    accuracy: 15.5
  })
});
```

### Python (requests)

```python
import requests

# Registro
response = requests.post(
    'https://rastreoapp-production.up.railway.app/api/auth/register',
    json={
        'email': 'test@test.com',
        'password': '123456'
    }
)

data = response.json()
token = data['token']

# Crear ubicación
requests.post(
    'https://rastreoapp-production.up.railway.app/api/locations',
    headers={
        'Authorization': f'Bearer {token}'
    },
    json={
        'device_id': 1,
        'latitude': 4.123456,
        'longitude': -74.123456,
        'accuracy': 15.5
    }
)
```

## 🚀 Rate Limiting

Actualmente no hay rate limiting implementado, pero se recomienda:

- Máximo 60 requests por minuto por usuario
- Máximo 1 ubicación por segundo por dispositivo

## 📊 Paginación

Para endpoints que retornan listas, usa el parámetro `limit`:

```
GET /api/locations/device/1?limit=50
```

## 🔄 Versionado

La API actual es v1. Futuras versiones se indicarán en la URL:

- v1: `/api/...` (actual)
- v2: `/api/v2/...` (futuro)

---

**Última actualización**: Noviembre 2025

Para más información, contacta: api@rastreoapp.com

