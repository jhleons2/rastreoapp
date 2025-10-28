# 🧪 Guía Completa de Prueba del Sistema

**Sistema de Rastreo Geográfico - Prueba End-to-End**

---

## 📋 Índice

1. [Prerequisitos](#prerequisitos)
2. [Compilar APK para Android](#compilar-apk)
3. [Probar Backend](#probar-backend)
4. [Probar Frontend Web](#probar-frontend)
5. [Probar App Móvil](#probar-app)
6. [Prueba Completa del Seguimiento](#prueba-seguimiento)
7. [Troubleshooting](#troubleshooting)

---

## 1️⃣ Prerequisitos

### Software Necesario

- **Android Studio** (descargar desde: https://developer.android.com/studio)
- **Node.js** v16+ (ya lo tienes)
- **npm** o **yarn**
- **Git** (ya lo tienes)
- **Un teléfono Android** (mínimo Android 6.0)

### Cuentas y URLs

- **Backend:** https://rastreoapp-production.up.railway.app
- **Frontend:** https://rastreoapp-frontend-production.up.railway.app
- **Repositorio:** https://github.com/jhleons2/rastreoapp

---

## 2️⃣ Compilar APK para Android

### Opción A: Compilar APK (Para Instalar en Celular) ⭐ RECOMENDADO

#### Paso 1: Configurar Android Studio

```bash
# Descargar e instalar Android Studio desde:
https://developer.android.com/studio

# Durante la instalación, instalar:
- Android SDK
- Android SDK Platform
- Android Virtual Device (AVD)
```

#### Paso 2: Configurar Variables de Entorno

**Windows (PowerShell):**
```powershell
# Agregar al PATH (en Variables de Entorno del Sistema):
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\platform-tools"
$env:Path += ";$env:ANDROID_HOME\tools"
$env:Path += ";$env:ANDROID_HOME\tools\bin"
```

**Verificar instalación:**
```bash
adb version  # Debería mostrar versión de adb
```

#### Paso 3: Instalar Dependencias del Proyecto

```bash
cd mobile
npm install
```

#### Paso 4: Configurar Android en el Proyecto

```bash
cd android
# Asegúrate de estar en la carpeta mobile/android

# Verificar que gradlew existe
dir gradlew  # Windows
```

Si no existe el archivo `gradlew`, necesitas crear el proyecto de cero:

```bash
# Volver a la raíz del proyecto mobile
cd ..
npx react-native init RastreoAppTemp --version 0.72.0
# Copiar archivos a RastreoAppTemp
# Luego renombrar
```

#### Paso 5: Compilar APK

```bash
# Desde mobile/android
cd android

# Compilar APK de debug (más rápido, para pruebas)
./gradlew assembleDebug
# En Windows, usa:
gradlew.bat assembleDebug
```

La APK estará en:
```
mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

#### Paso 6: Instalar APK en el Celular

**Opción 1: Por USB**
```bash
# Conectar celular por USB y activar "Depuración USB" en opciones de desarrollador
adb install app/build/outputs/apk/debug/app-debug.apk
```

**Opción 2: Compartir Archivo**
- Copiar `app-debug.apk` al celular
- Abrir el archivo en el celular
- Permitir "Instalar desde fuentes desconocidas"

---

### Opción B: Usar Expo Go (Más Fácil para Pruebas Rápidas)

Si compilar la APK es complicado, puedes usar Expo:

```bash
cd mobile

# Instalar Expo CLI
npm install -g expo-cli

# Iniciar servidor
npx expo start
```

Esto generará un código QR que escaneas con la app **Expo Go** (descargar desde Play Store).

---

## 3️⃣ Probar Backend

### 3.1 Health Check

```bash
curl https://rastreoapp-production.up.railway.app/health
```

**Respuesta esperada:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-XX",
  "database": "connected"
}
```

### 3.2 Crear Usuario de Prueba

```bash
curl -X POST https://rastreoapp-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+573001234567",
    "email": "prueba@test.com",
    "password": "test123"
  }'
```

**Respuesta esperada:**
```json
{
  "message": "Usuario registrado exitosamente",
  "userId": 1
}
```

### 3.3 Login

```bash
curl -X POST https://rastreoapp-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+573001234567",
    "password": "test123"
  }'
```

**Respuesta esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "phone_number": "+573001234567", ... }
}
```

### 3.4 Crear Dispositivo

```bash
# Usa el token del login anterior
TOKEN="eyJhbGciOi又如I1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST https://rastreoapp-production.up.railway.app/api/devices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "device_name": "Celular de Prueba",
    "device_type": "Android",
    "is_active": true
  }'
```

### 3.5 Enviar Ubicación

```bash
curl -X POST https://rastreoapp-production.up.railway.app/api/locations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "device_id": 1,
    "latitude": 4.6097,
    "longitude": -74.0817,
    "accuracy": 10,
    "altitude": 2640,
    "speed": 0,
    "heading": 0
  }'
```

---

## 4️⃣ Probar Frontend Web

### 4.1 Abrir Dashboard

Abre en el navegador:
```
https://rastreoapp-frontend-production.up.railway.app
```

### 4.2 Registrar Usuario en el Dashboard

1. Click en "Registrarse"
2. Ingresa datos:
   - Teléfono: +573001234567
   - Email: prueba@test.com
   - Contraseña: test123
3. Click "Crear Cuenta"

### 4.3 Iniciar Sesión

1. Ingresa teléfono y contraseña
2. Click "Iniciar Sesión Presenta el Dashboard

### 4.4 Crear Dispositivo desde Dashboard

1. Ve a la pestaña "Dispositivos"
2. Click "Agregar Dispositivo"
3. Ingresa:
   - Nombre: Celular de Prueba
   - Tipo: Android
   - Estado: Activo
4. Click "Guardar"

### 4.5 Ver Mapa de Ubicaciones

1. Ve a la pestaña "Ubicaciones"
2. Selecciona el dispositivo
3. Verás el mapa con ubicaciones (si hay)

---

## 5️⃣ Probar App Móvil

### 5.1 Instalar App

**Método 1: APK compilada**
- Instalar `app-debug.apk` en el celular

**Método 2: Expo Go**
- Escanear QR con Expo Go

### 5.2 Flujo de Prueba en la App

#### Paso 1: Abrir App
- Abre la app "RastreoApp" en tu celular

#### Paso 2: Registrar Usuario
1. Click en "Regístrate"
2. Ingresa:
   - Teléfono: +573001234567 (usa tu número real)
   - Email: prueba@test.com
   - Contraseña: test123
3. Click "Crear Cuenta"

#### Paso 3: Iniciar Sesión
1. Ingresa tu número de teléfono
2. Ingresa contraseña
3. Click "Iniciar Sesión"

#### Paso 4: Aceptar Permisos
1. La app solicitará permisos de ubicación
2. Click "Permitir" o "Aceptar"
3. Si aparece una segunda solicitud (para usar ubicación en segundo plano), también acepta

#### Paso 5: Iniciar Rastreo
1. Click en el botón "INICIAR RASTREO"
2. El estado cambiará a "RASTREO ACTIVO"
3. Verás tu ubicación en pantalla

#### Paso 6: Verificar que Envía Datos
1. Espera 10 minutos (o modifica el intervalo en el código)
2. Verifica los logs en la pantalla de la app
3. Deberías ver mensajes como:
   - "Ubicación enviada correctamente"
   - "Coordenadas: lat, lon"

---

## 6️⃣ Prueba Completa del Seguimiento

### Escenario de Prueba Completo

Este escenario prueba todo el flujo end-to-end:

#### Parte 1: Preparación (5 min)

1. **Backend funcionando:**
   ```bash
   curl https://rastreoapp-production.up.railway.app/health
   ```
   ✅ Debe responder OK

2. **Frontend funcionando:**
   - Abre: https://rastreoapp-frontend-production.up.railway.app
   ✅ Debe cargar el login

3. **App instalada en celular:**
   ✅ APK instalada o Expo Go conectado

#### Parte 2: Usuario Nuevo (5 min)

1. **Crear cuenta en la App:**
   - Teléfono: +573001234567
   - Email: prueba@app.com
   - Contraseña: test123
   ✅ Usuario creado

2. **Iniciar sesión en la App:**
   ✅ Login exitoso

3. **Verificar en Backend:**
   ```bash
   curl -X GET https://rastreoapp-production.up.railway.app/api/users/1 \
     -H "Authorization: Bearer $TOKEN"
   ```
   ✅ Debe devolver el usuario creado

#### Parte 3: Rastreo Básico (10 min)

1. **Iniciar rastreo en App:**
   - Click "INICIAR RASTREO"
   - Aceptar permisos
   ✅ Estado: "RASTREO ACTIVO"

2. **Esperar primera ubicación (10 segundos):**
   - App debe mostrar: "Ubicación: lat, lon"
   ✅ Ubicación capturada

3. **Verificar en Backend:**
   ```bash
   curl -X GET https://rastreoapp-production.up.railway.app/api/locations \
     -H "Authorization: Bearer $TOKEN"
   ```
   ✅ Debe devolver array con 1 ubicación

4. **Ver en Dashboard Web:**
   - Inicia sesión en el dashboard
   - Ve a "Ubicaciones"
   - Selecciona el dispositivo
   - Verás el mapa con un marcador
   ✅ Ubicación en mapa

#### Parte 4: Rastreo Prolongado (15 min)

1. **Dejar app activa:**
   - Mantén la app abierta
   - Camina o mueve el celular

2. **Cada 10 minutos:**
   - La app enviará una nueva ubicación
   - Verás el mensaje "Ubicación enviada" en la app

3. **Verificar acumulación:**
   ```bash
   curl -X GET https://rastreoapp-production.up.railway.app/api/locations/device/1 \
     -H "Authorization: Bearer $TOKEN"
   ```
   ✅ Debe devolver varias ubicaciones

4. **Ver en Dashboard:**
   - Actualiza la página de Locations
   - Deberías ver varios marcadores en el mapa
   - Deberías ver una línea que conecta las ubicaciones
   ✅ Ruta visible en mapa

#### Parte 5: Múltiples Dispositivos (Opcional - 10 min)

1. **Crear segundo dispositivo en Dashboard:**
   - Ve a "Dispositivos"
   - Click "Agregar Dispositivo"
   - Nombre: Tableta de Casa
   - Tipo: Android

2. **Desde otro celular/emulador:**
   - Abre la app
   - Inicia sesión con la MISMA cuenta
   - Se creará automáticamente otro dispositivo

3. **Rastrear ambos:**
   - Inicia rastreo en ambos dispositivos
   - Moverse en diferentes ubicaciones

4. **Ver en Dashboard:**
   - Selecciona cada dispositivo
   - Verás ubicaciones diferentes en cada uno
   ✅ Múltiples dispositivos rastreando

---

## 7️⃣ Checklist de Prueba

### Backend ✅
- [ ] Health check responde OK
- [ ] Registro de usuario funciona
- [ ] Login devuelve token JWT
- [ ] Crear dispositivo funciona
- [ ] Enviar ubicación funciona
- [ ] Obtener ubicaciones devuelve datos

### Frontend ✅
- [ ] Dashboard carga correctamente
- [ ] Login funciona
- [ ] Registro funciona
- [ ] Gráficos muestran datos
- [ ] Gestión de dispositivos funciona
- [ ] Mapa carga y muestra ubicaciones

### App Móvil ✅
- [ ] App se instala correctamente
- [ ] Login funciona
- [ ] Registro funciona
- [ ] Permisos se solicitan
- [ ] Permisos se otorgan
- [ ] Rastreo se inicia
- [ ] Ubicación se captura
- [ ] Ubicación se envía al backend
- [ ] Múltiples ubicaciones se envían

### Integración ✅
- [ ] Usuario creado en app aparece en backend
- [ ] Ubicaciones de app aparecen en backend
- [ ] Ubicaciones de app aparecen en dashboard
- [ ] Mapa muestra ubicaciones correctas
- [港澳] Gráficos actualizan con nuevos datos

---

## 8️⃣ Troubleshooting

### Error: "Cannot connect to backend"

**Causa:** La URL del backend en la app está incorrecta.

**Solución:**
1. Editar `mobile/src/config/api.js`
2. Verificar que la URL sea: `https://rastreoapp-production.up.railway.app/api`

### Error: "Permission denied" en GPS

**Causa:** Permisos no otorgados correctamente.

**Solución:**
1. Android: Settings > Apps > RastreoApp > Permissions > Location > Allow all the time
2. Verificar `AndroidManifest.xml` tiene los permisos
3. Reinstalar la app

### Error: "Unable to load script"

**Causa:** Metro bundler no está corriendo.

**Solución:**
```bash
cd mobile
npm start -- --reset-cache
```

### Error: "Apk not found"

**Causa:** La APK no se compiló.

**Solución:**
```bash
cd mobile/android
gradlew.bat assembleDebug
# Windows
```

### La ubicación no se envía

**Causa:** Token JWT expirado o incorrecto.

**Solución:**
1. Cerrar sesión en la app
2. Volver a iniciar sesión
3. Iniciar rastreo nuevamente

### El mapa no muestra ubicaciones

**Causa:** Leaflet no carga o no hay datos.

**Solución:**
1. Verificar que el backend tiene ubicaciones: `GET /api/locations`
2. Verificar la consola del navegador por errores
3. Verificar que Leaflet CSS está cargado

---

## 📊 Resultados Esperados

### Después de una Prueba Completa Exitosa:

✅ **Backend:**
- 1 usuario creado
- 1 o más dispositivos creados
- 5-10 ubicaciones almacenadas
- Todas las ubicaciones con lat/lon válidos

✅ **Frontend:**
- Dashboard muestra estadísticas correctas
- Gráfico muestra dispositivos activos/inactivos
- Lista de dispositivos funciona
- Mapa muestra marcadores y ruta

✅ **App Móvil:**
- Usuario autenticado correctamente
- Permisos de ubicación otorgados
- Rastreo activo
- Ubicaciones enviándose cada 10 minutos

---

## 🎯 Demo para Presentación

### Script de Demo (15 minutos)

1. **Intro (2 min)**
   - Mostrar diagrama del sistema
   - Explicar arquitectura

2. **Backend (3 min)**
   - Mostrar health check
   - Hacer curl de registro
   - Hacer curl de creación de dispositivo

3. **Frontend (3 min)**
   - Mostrar dashboard con estadísticas
   - Crear dispositivo desde el dashboard
   - Mostrar gráficos

4. **App Móvil (7 min)** ⭐
   - Mostrar app instalada en celular
   - Mostrar registro con número de teléfono
   - Solicitar permisos GPS
   - Iniciar rastreo
   - Mostrar que se envía ubicación
   - Esperar 1-2 minutos
   - Mostrar en dashboard web que apareció la ubicación
   - Mostrar mapa con ubicaciones

---

## 🎉 ¡Listo para Probar!

Sigue esta guía paso a paso y tendrás un sistema completamente funcional para demostrar.

**Preguntas frecuentes:**

**Q: ¿Necesito compilar la APK o puedo usar Expo?**  
A: Para una demo funcional completa, usa la APK compilada. Para pruebas rápidas, Expo es más fácil.

**Q: ¿Cuánto tiempo tarda en enviar la primera ubicación?**  
A: Inmediatamente después de iniciar el rastreo (el intervalo de 10 minutos es para ubicaciones posteriores).

**Q: ¿Puedo cambiar el intervalo de envío?**  
A: Sí, edita `LocationService.js` y cambia el valor de `interval`.

---

**¡Éxito con la prueba del sistema!** 🚀

