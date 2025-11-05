# 🚀 Instrucciones Rápidas - App Móvil

## Método Más Fácil: Usar Expo Go

### Paso 1: Instalar Expo CLI

```bash
npm install -g expo-cli
```

### Paso 2: Ir a la Carpeta de la App

```bash
cd mobile
```

### Paso 3: Instalar Dependencias

```bash
npm install
```

### Paso 4: Iniciar el Servidor

```bash
npx expo start
```

Esto abrirá una ventana en el navegador con un **código QR**.

### Paso 5: Instalar Expo Go en tu Celular

- **Android:** Buscar "Expo Go" en Google Play Store
- **iOS:** Buscar "Expo Go" en App Store

Instalar la app **Expo Go**.

### Paso 6: Escanear el QR

1. Abre **Expo Go** en tu celular
2. Escanea el código QR que apareció en la terminal
3. La app se abrirá en tu celular

---

## ⚡ Prueba Rápida del Sistema

### 1. Prueba Backend

```bash
curl https://rastreoapp-production.up.railway.app/health
```

**Debe responder:**
```json
{"status": "OK"}
```

### 2. Prueba Frontend

Abre en navegador:
```
https://rastreoapp-frontend-production.up.railway.app
```

### 3. Prueba App Móvil

1. Escanea el QR con Expo Go
2. La app se carga en tu celular
3. Registra un usuario con tu número de teléfono
4. Inicia sesión
5. Click en "INICIAR RASTREO"
6. Acepta permisos de ubicación
7. **¡Listo!** La app enviará tu ubicación cada 10 minutos

---

## 📱 Flujo Completo de Prueba

### En la App Móvil:

1. **Registro** (si no tienes cuenta):
   - Teléfono: +573001234567
   - Email: prueba@test.com
   - Contraseña: test123
   - Click "Crear Cuenta"

2. **Login**:
   - Ingresa tu número de teléfono
   - Ingresa tu contraseña
   - Click "Iniciar Sesión"

3. **Iniciar Rastreo**:
   - Click en "INICIAR RASTREO"
   - Acepta los permisos de ubicación
   - El estado cambiará a "RASTREO ACTIVO"

4. **Verificar Ubicaciones**:
   - Espera 1-2 minutos
   - Abre el dashboard web
   - Ve a "Locations" en el menú
   - Deberías ver tu ubicación en el mapa

---

## 🗺️ Ver las Ubicaciones en el Dashboard

1. Abre: https://rastreoapp-frontend-production.up.railway.app
2. Inicia sesión con las mismas credenciales
3. Ve a la pestaña **"Locations"** (Ubicaciones)
4. Selecciona tu dispositivo en el dropdown
5. Verás:
   - Un mapa interactivo
   - Marcadores en tus ubicaciones
   - Una línea conectando las ubicaciones

---

## ⚠️ Solución de Problemas

### Error: "Unable to resolve module expo"

```bash
cd mobile
rm -rf node_modules
npm install
npx expo start
```

### Error: "No bundle URL present"

```bash
npx expo start --clear
```

### El QR no aparece

Abre manualmente:
```
http://localhost:19000
```

### La app no carga en Expo Go

1. Asegúrate de estar conectado a la misma WiFi que tu computadora
2. O usa "Tunnel" en el menú de Expo

---

## 📊 Resultado Esperado

### Después de 10 minutos de rastreo:

✅ **Backend:** 2-3 ubicaciones almacenadas  
✅ **Dashboard:** Mapa muestra tu ruta  
✅ **App:** Estado "RASTREO ACTIVO"  
✅ **Logs:** "Location sent successfully" aparecen en la terminal

---

## 🎯 Para la Presentación

### Demo (10 minutos):

1. **Backend (2 min)**:
   - Mostrar health check
   - Mostrar registro de usuario via curl

2. **Dashboard Web (3 min)**:
   - Mostrar login y dashboard
   - Mostrar gráficos
   - Mostrar gestión de dispositivos

3. **App Móvil (5 min)**: ⭐
   - Mostrar app en celular
   - Mostrar registro con número de teléfono
   - Mostrar solicitud de permisos GPS
   - Iniciar rastreo
   - Esperar 1 minuto
   - Mostrar en dashboard web que apareció la ubicación

---

## 🎉 ¡Listo!

Con estos pasos tienes un sistema completo funcionando:
- ✅ Backend en Railway
- ✅ Frontend en Railway
- ✅ App móvil en tu celular

**¿Necesitas la APK compilada?**  
Ver `GUIA_COMPLETA_PRUEBA_SISTEMA.md` para compilar la APK.

