# 🧪 Cómo Probar la API del Sistema de Rastreo

## 📍 URL de la API

**Base URL:** `https://rastreoapp-production.up.railway.app`

---

## 🚀 Endpoints Disponibles

### 1. Health Check (Sin autenticación)
```
GET /health
```

**Respuesta:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-10-28T02:06:03.823Z",
  "environment": "production",
  "version": "1.0.0"
}
```

---

### 2. Autenticación

#### 2.1. Registrar Usuario
```
POST /api/auth/register
Content-Type: application/json

{
  "phone_number": "+573001234567",
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "phone_number": "+573001234567",
    "email": "usuario@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2.2. Login
```
POST /api/auth/login
Content-Type: application/json

{
  "phone_number": "+573001234567",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "phone_number": "+573001234567",
    "email": "usuario@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**⚠️ Guarda el `token` para usar en las siguientes peticiones.**

---

### 3. Perfil (Con autenticación)
```
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta:**
```json
{
  "id": 1,
  "phone_number": "+573001234567",
  "email": "usuario@example.com",
  "devices": [...]
}
```

---

### 4. Dispositivos

#### 4.1. Listar Dispositivos
```
GET /api/devices
Authorization: Bearer [tu_token]
```

#### 4.2. Crear Dispositivo
```
POST /api/devices
Authorization: Bearer [tu_token]
Content-Type: application/json

{
  "device_name": "Mi Celular Android",
  "device_type": "mobile"
}
```

**Respuesta:**
```json
{
  "id": 1,
  "user_id": 1,
  "device_name": "Mi Celular Android",
  "device_type": "mobile",
  "is_active": true,
  "created_at": "2025-10-28T02:10:00.000Z"
}
```

#### 4.3. Ver Dispositivo Específico
```
GET /api/devices/:device_id
Authorization: Bearer [tu_token]
```

#### 4.4. Actualizar Dispositivo
```
PUT /api/devices/:device_id
Authorization: Bearer [tu_token]
Content-Type: application/json

{
  "device_name": "Mi Nuevo Nombre",
  "is_active": false
}
```

#### 4.5. Eliminar Dispositivo
```
DELETE /api/devices/:device_id
Authorization: Bearer [tu_token]
```

---

### 5. Ubicaciones

#### 5.1. Enviar Ubicación
```
POST /api/locations
Authorization: Bearer [tu_token]
Content-Type: application/json

{
  "device_id": 1,
  "latitude": 4.6097102,
  "longitude": -74.0817472,
  "accuracy": 10.5,
  "altitude": 2598.5,
  "speed": 0,
  "heading": 90
}
```

**Respuesta:**
```json
{
  "id": 1,
  "device_id": 1,
  "latitude": "4.60971020",
  "longitude": "-74.08174720",
  "accuracy": "10.50",
  "altitude": "2598.50",
  "speed": "0.00",
  "heading": "90.00",
  "timestamp": "2025-10-28T02:10:00.000Z"
}
```

#### 5.2. Obtener Ubicaciones de un Dispositivo
```
GET /api/locations/device/:device_id
Authorization: Bearer [tu_token]

Query params:
- start_date: 2025-10-01 (opcional)
- end_date: 2025-10-28 (opcional)
- limit: 50 (opcional, default 100)
```

#### 5.3. Obtener Ubicación Actual
```
GET /api/locations/device/:device_id/current
Authorization: Bearer [tu_token]
```

---

## 🧪 Cómo Probar con Postman

### Configuración Inicial

1. **Instalar Postman** (si no lo tienes)

2. **Crear Colección:**
   - Nueva colección: "Rastreo API"
   - Base URL: `https://rastreoapp-production.up.railway.app`

3. **Variables de Colección:**
   - `base_url`: `https://rastreoapp-production.up.railway.app`
   - `token`: (se llenará después del login)

---

### Flujo de Prueba Completo

#### Paso 1: Registrar Usuario
```
POST {{base_url}}/api/auth/register
Body (raw JSON):
{
  "phone_number": "+573001234567",
  "email": "test@example.com",
  "password": "test123"
}
```
**Copia el `token` de la respuesta.**

#### Paso 2: Guardar Token
- En Postman, variables → `token`
- Pega el token recibido

#### Paso 3: Crear Dispositivo
```
POST {{base_url}}/api/devices
Headers: Authorization: Bearer {{token}}
Body:
{
  "device_name": "Mi Dispositivo",
  "device_type": "mobile"
}
```
**Copia el `device_id` de la respuesta.**

#### Paso 4: Enviar Ubicación
```
POST {{base_url}}/api/locations
Headers: Authorization: Bearer {{token}}
Body:
{
  "device_id": 1,
  "latitude": 4.6097,
  "longitude": -74.0817,
  "accuracy": 10.5
}
```

#### Paso 5: Ver Ubicaciones
```
GET {{base_url}}/api/locations/device/1
Headers: Authorization: Bearer {{token}}
```

#### Paso 6: Ver Ubicación Actual
```
GET {{base_url}}/api/locations/device/1/current
Headers: Authorization: Bearer {{token}}
```

---

## 🧪 Cómo Probar con curl

### 1. Registrar Usuario
```bash
curl -X POST https://rastreoapp-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phone_number":"+573001234567","password":"test123"}'
```

### 2. Login
```bash
curl -X POST https://rastreoapp-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone_number":"+573001234567","password":"test123"}'
```

### 3. Crear Dispositivo (reemplaza TOKEN)
```bash
curl -X POST https://rastreoapp-production.up.railway.app/api/devices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -d '{"device_name":"Mi Dispositivo","device_type":"mobile"}'
```

### 4. Enviar Ubicación
```bash
curl -X POST https://rastreoapp-production.up.railway.app/api/locations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -d '{"device_id":1,"latitude":4.6097,"longitude":-74.0817,"accuracy":10}'
```

---

## ✅ Respuestas Esperadas

### Éxito (201 Created)
```json
{
  "id": 1,
  ...
}
```

### Éxito (200 OK)
```json
[...] // Array de objetos
```

### Error de Autenticación (401)
```json
{
  "error": "No token provided"
}
```

### Error de Validación (400)
```json
{
  "error": "Phone number is required"
}
```

### Error No Encontrado (404)
```json
{
  "error": "Device not found"
}
```

---

## 🐛 Troubleshooting

### Error: "No token provided"
→ Asegúrate de incluir el header: `Authorization: Bearer [token]`

### Error: "User already exists"
→ El número de teléfono ya está registrado. Usa otro o haz login.

### Error: "Device not found"
→ Verifica que el device_id sea correcto y que pertenezca a tu usuario.

### Error: "Invalid credentials"
→ El password es incorrecto o el usuario no existe.

---

## 📊 Diagrama de Flujo

```
1. Register/Login → Obtener TOKEN
                    ↓
2. Crear Device → Obtener DEVICE_ID
                    ↓
3. Enviar Locations → Guardar en BD
                    ↓
4. Consultar Locations → Obtener historial
```

---

## 🎯 Ejemplo Completo de Uso

### En Postman:

1. **Register** → Token: `eyJhbGci...`
2. **Login** → Mismo usuario (opcional)
3. **Create Device** → Device ID: `1`
4. **Send Location** → Location guardada
5. **Get Locations** → Ver historial
6. **Get Current Location** → Ver última ubicación

---

**¡Listo para probar! Prueba en Postman o con curl.** 🚀

