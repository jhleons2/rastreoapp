# 📱 App Móvil - RastreoApp

App móvil React Native para el sistema de rastreo geográfico.

---

## ✅ Requisitos Cumplidos (4.3.1)

- ✅ Android/iOS app instalada
- ✅ Solicitud de permisos de GPS/localización
- ✅ Envío periódico de coordenadas al servidor
- ✅ Vinculación con número telefónico

---

## 🚀 Instalación

### Prerequisitos

1. Node.js 16+
2. React Native CLI
3. Android Studio (para Android)
4. Xcode (para iOS)

### Pasos

```bash
cd mobile
npm install

# Para Android
npm run android

# Para iOS
npm run ios
```

---

## 📱 Estructura del Proyecto

```
mobile/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   └── TrackingScreen.js
│   ├── services/
│   │   └── LocationService.js
│   └── config/
│       └── api.js
├── App.js
├── index.js
└── package.json
```

---

## 🎯 Funcionalidades

### Autenticación
- Login con número de teléfono
- Registro de usuario
- Almacenamiento de token JWT

### Rastreo
- Solicitud de permisos GPS
- Envío automático cada 10 minutos
- Detener/iniciar rastreo
- Vista de ubicación actual

### Seguridad
- Tokens seguros
- Permisos controlados
- Validación de datos

---

## 🔧 Configuración

### URL del Backend

El backend está configurado para:
```
https://rastreoapp-production.up.railway.app
```

Para cambiar la URL, edita: `src/config/api.js`

---

## 📲 Flujo de Usuario

1. **Login/Registro**
   - Usuario se registra con número de teléfono
   - Opcionalmente puede agregar email y contraseña

2. **Crear Dispositivo**
   - Al iniciar sesión, se crea automáticamente un dispositivo
   - Se guarda el device_id localmente

3. **Iniciar Rastreo**
   - Usuario solicita permisos de ubicación
   - Rastreo comienza automáticamente
   - Envía ubicación cada 10 minutos

4. **Continuar en Background**
   - App sigue enviando ubicaciones en segundo plano
   - Configurado con permiso ACCESS_BACKGROUND_LOCATION

---

## 🔐 Permisos

### Android
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
```

### iOS
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Necesitamos tu ubicación para el rastreo</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Necesitamos tu ubicación en segundo plano para el rastreo continuo</string>
```

---

## 📊 Estados del Rastreo

- **INACTIVO:** No se está enviando ubicación
- **ACTIVO:** Rastreo en progreso, enviando cada 10 minutos
- **BACKGROUND:** Continúa enviando en segundo plano

---

## 🧪 Pruebas

### 1. Instalar en dispositivo Android

```bash
npm run android
```

### 2. Probar flujo completo

1. Abrir app
2. Registrarse con número de teléfono
3. Iniciar rastreo
4. Permitir permisos de ubicación
5. Verificar que se envíen ubicaciones al backend

### 3. Verificar en Backend

```bash
# Ver ubicaciones enviadas
curl -X GET https://rastreoapp-production.up.railway.app/api/locations/device/1 \
  -H "Authorization: Bearer TOKEN"
```

---

## 📝 Notas Técnicas

- El intervalo de envío es configurable (por defecto 10 minutos)
- Usa high accuracy para mejor precisión
- Maneja errores de red graciosamente
- Continúa rastreando en segundo plano

---

**Desarrollado para Taller 2 de Redes MCIC**

