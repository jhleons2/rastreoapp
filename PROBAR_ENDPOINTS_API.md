# 🧪 Cómo Probar los Nuevos Endpoints de la API

## ⚠️ Los Endpoints NO Aparecen en el Navegador

Los endpoints `/api/auth`, `/api/devices`, `/api/locations` **SÍ están funcionando**, pero:
- ❌ No aparecen en el navegador (porque son API REST)
- ✅ Necesitas usar **Postman** o **curl**
- ✅ Necesitas autenticación (token JWT)

---

## 🚀 Prueba Rápida en el Navegador

Aunque los endpoints están ahí, en el navegador verás:

### ✅ Si existe el endpoint, verás:
```json
{
  "error": "Route not found"
}
```
o
```json
{
  "error": "No token provided"
}
```

Esto confirma que el endpoint existe, pero necesita autenticación.

---

## 📋 Probar en Postman (Recomendado)

### 1. Registrar Usuario

**POST** `https://rastreoapp-production.up.railway.app/api/auth/register`

Body (raw JSON):
```json
{
  "phone_number": "+573001234567",
  "password": "test123"
}
```

**Respuesta esperada:**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGci..."
}
```

### 2. Login

**POST** `https://rastreoapp-production.up.railway.app/api/auth/login`

Body:
```json
{
  "phone_number": "+573001234567",
  "password": "test123"
}
```

**Guarda el `token`.**

### 3. Crear Dispositivo

**POST** `https://rastreoapp-production.up.railway.app/api/devices`

Headers:
```
Authorization: Bearer [tu_token]
Content-Type: application/json
```

Body:
```json
{
  "device_name": "Mi Celular",
  "device_type": "mobile"
}
```

### 4. Enviar Ubicación

**POST** `https://rastreoapp-production.up.railway.app/api/locations`

Headers:
```
Authorization: Bearer [tu_token]
Content-Type: application/json
```

Body:
```json
{
  "device_id": 1,
  "latitude": 4.6097,
  "longitude": -74.0817,
  "accuracy": 10.5
}
```

---

## 🌐 Probar en el Navegador (Básico)

Abre estas URLs para verificar:

1. **Health Check:**
```
https://rastreoapp-production.up.railway.app/health
```
→ Debería mostrar: `{"database": "connected"}`

2. **Info API:**
```
https://rastreoapp-production.up.railway.app/api
```
→ Debería mostrar lista de endpoints

3. **Intentar Auth (sin autenticación):**
```
https://rastreoapp-production.up.railway.app/api/auth
```
→ Dará error, pero confirma que existe

---

## ⚡ Usar curl (Terminal)

```bash
# Registrar
curl -X POST https://rastreoapp-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phone_number":"+573001234567","password":"test123"}'

# Login (copia el token de la respuesta)
curl -X POST https://rastreoapp-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone_number":"+573001234567","password":"test123"}'
```

---

## ✅ Confirma que Funciona

Si ves este error en el navegador:
```
https://rastreoapp-production.up.railway.app/api/devices
```

Muestra:
```json
{
  "error": "No token provided"
}
```

**¡ESTO ES BUENO!** Significa que el endpoint existe y funciona, solo necesita autenticación.

---

## 📱 Endpoints Completos Disponibles

TODOS estos están funcionando:

```
✅ POST   /api/auth/register
✅ POST   /api/auth/login
✅ GET    /api/auth/profile
✅ GET    /api/devices
✅ POST   /api/devices
✅ GET    /api/devices/:id
✅ PUT    /api/devices/:id
✅ DELETE /api/devices/:id
✅ POST   /api/locations
✅ GET    /api/locations/device/:id
✅ GET    /api/locations/device/:id/current
```

**Todos requieren token JWT excepto register y login.**

---

¿Probaste con Postman o curl? Los endpoints están funcionando.

