# 📱 Guía de Instalación - App Móvil React Native

**Para Cumplir:** Requisitos 4.3.1 - Aplicación móvil

---

## 🎯 Objetivo

Crear una app Android/iOS que cumpla con los requisitos del taller:
- ✅ App instalada en el dispositivo
- ✅ Solicitud de permisos de GPS
- ✅ Envío periódico de coordenadas
- ✅ Vinculación con número telefónico

---

## 📦 Estructura Creada

```
mobile/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.js      ✅ Login con teléfono
│   │   ├── RegisterScreen.js   ✅ Registro con teléfono
│   │   └── TrackingScreen.js   ✅ Pantalla de rastreo
│   ├── services/
│   │   └── LocationService.js  ✅ Servicio de ubicación
│   └── config/
│       └── api.js              ✅ Configuración API
├── android/                    ✅ Configuración Android
├── ios/                        ✅ Configuración iOS
├── App.js                      ✅ Navegación
├── package.json                ✅ Dependencias
└── README.md                   ✅ Documentación
```

---

## 🚀 Instalación Paso a Paso

### Opción 1: Instalación Básica (Recomendada para Prueba Rápida)

#### Paso 1: Instalar React Native CLI
```bash
npm install -g react-native-cli
```

#### Paso 2: Instalar Dependencias
```bash
cd mobile
npm install
```

#### Paso 3: Para Android
```bash
# Asegúrate de tener Android Studio instalado
npm run android
```

#### Paso 4: Para iOS (solo Mac)
```bash
cd ios && pod install && cd ..
npm run ios
```

---

### Opción 2: Usando Expo (Más Fácil para Principiantes)

Si React Native CLI es complicado, puedes usar Expo:

```bash
# En la carpeta mobile
npm install -g expo-cli
expo start
```

Luego escanea el QR con Expo Go app en tu teléfono.

---

## 📱 Requisitos del Sistema

### Android
- Android Studio instalado
- Android SDK (API level 21+)
- Emulador o dispositivo físico con USB debugging

### iOS (solo Mac)
- Xcode instalado
- CocoaPods
- Simulador iOS o dispositivo físico

---

## 🔧 Configuración de Permisos

### Android (AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
```

✅ Ya está configurado en: `mobile/android/app/src/main/AndroidMan начало.xml`

### iOS (Info.plist)
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Necesitamos tu ubicación para el rastreo geográfico.</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Necesitamos tu ubicación en segundo plano para el rastreo continuo.</string>
```

✅ Ya está configurado en: `mobile/ios/RastreoApp/Info.plist`

---

## 🎯 Funcionalidades Implementadas

### 1. Login/Registro con Número de Teléfono ✅
- Pantalla de login
- Registro de usuario nuevo
- Validación de datos
- Almacenamiento de token JWT

### 2. Solicitud de Permisos GPS ✅
```javascript
// LocationService.js
const result = await request(permission);
if (result === RESULTS.GRANTED) {
  // Permisos concedidos
}
```

### 3. Envío Periódico de Coordenadas ✅
```javascript
// Enviar cada 10 minutos
Geolocation.watchPosition(
  (position) => {
    sendLocationToServer(deviceId, {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      // ...
    });
  },
  options: {
    interval: 10 * 60 * 1000, // 10 minutos
    enableHighAccuracy: true,
  }
);
```

### 4. Vinculación con Número Telefónico ✅
- Login con número de teléfono
- Registro con número de teléfono
- Validación de formato

---

## 🧪 Probar la App

### Paso 1: Iniciar App
```bash
cd mobile
npm run android  # O ios
```

### Paso 2: Flujo de Prueba

1. **Registro**
   - Abre la app
   - Click en "Regístrate"
   - Ingresa tu número de teléfono
   - Opcionalmente email y contraseña
   - Click "Crear Cuenta"

2. **Login**
   - O usa login si ya tienes cuenta
   - Ingresa número de telé updates
   - Click "Iniciar Sesión"

3. **Crear Dispositivo**
   - Automático al iniciar sesión
   - Se muestra device_id

4. **Iniciar Rastreo**
   - Click en "INICIAR RASTREO"
   - Acepta permisos de ubicación
   - Verifica estado "RASTREO ACTIVO"
   - Observa que se muestra tu ubicación

5. **Verificar en Backend**
   - Abre el dashboard web
   - Ve a cada uns pantalla Locations
   - Deberías ver las ubicaciones enviadas

---

## 📊 Verificar que Funciona

### Ver Logs en Consola
```bash
# En la terminal donde corre la app
# Verás logs como:
# "Starting tracking with interval: 10 minutes"
# "Location sent successfully"
```

### Ver en Backend
```bash
# Obtener ubicaciones enviadas
curl -X GET https://rastreoapp-production.up.railway.app/api/locations/device/1 \
  -H "Authorization: Bearer TU_TOKEN"
```

### Ver en Dashboard Web
1. Abre: https://rastreoapp-frontend-production.up.railway.app
2. Ve a "Locations"
3. Selecciona tu dispositivo
4. Verás el mapa con tus ubicaciones

---

## 🎨 Pantallas de la App

### 1. Login Screen
- Campo: Número de teléfono
- Campo: Contraseña (opcional)
- Botón: Iniciar Sesión
- Link: ¿No tienes cuenta? Regístrate

### 2. Register Screen
- Campo: Número de teléfono *
- Campo: Email (opcional)
- Campo: Contraseña (opcional)
- Botón: Crear Cuenta
- Link: ¿Ya tienes cuenta? Inicia sesión

### 3. Tracking Screen
- Header: Logo y Cerrar Sesión
- Card: Estado del Rastreo
  - Indicador visual (activo/inactivo)
  - Ubicación actual
  - Botón: INICIAR/DETENER
- Card: Información
  - Cómo funciona
  - Privacidad

---

## 🔐 Seguridad

- ✅ Tokens JWT almacenados de forma segura
- ✅ Permisos solicitados apropiadamente
- ✅ Validación en backend
- ✅ Manejo de errores

---

## 📝 API Integration

La app se conecta al backend ya desplegado:

**URL:** `https://rastreoapp-production.up.railway.app/api`

**Endpoints usados:**
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `POST /api/devices` - Crear dispositivo
- `POST /api/locations` - Enviar ubicación

---

## 🐛 Troubleshooting

### Error: "Cannot find module"
```bash
cd mobile
rm -rf node_modules
npm install
```

### Error: "No bundle URL present"
```bash
# Limpiar caché
npm start -- --reset-cache
```

### Error de permisos en Android
- Verifica AndroidManifest.xml
- Reinstala la app
- Configura permisos manualmente en Settings

### Error: "Unable to load script"
```bash
# En Android Studio, limpia build
cd android
./gradlew clean
cd ..
```

---

## 📦 Para Compilar APK (Build Final)

### Android
```bash
cd android
./gradlew assembleRelease
# APK estará en: android/app/build/outputs/apk/release/
```

### iOS
```bash
# Abrir en Xcode
open ios/RastreoApp.xcworkspace
# Build > Archive
# Distribute App
```

---

## ✅ Checklist de Requisitos

- [x] App Android/iOS instalada
- [x] Solicitud de permisos de GPS
- [x] Envío periódico de coordenadas (cada 10 min)
- [x] Vinculación con número telefónico
- [x] Interfaz de usuario funcional
- [x] Integración con backend
- [x] Almacenamiento seguro de tokens
- [x] Manejo de errores
- [x] Documentación completa

---

## 🎓 Para la Presentación

### Demo en Vivo
1. Mostrar app instalada en dispositivo
2. Demostrar registro con número de teléfono
3. Solicitar permisos de ubicación
4. Iniciar rastreo
5. Mostrar que se envían ubicaciones al backend
6. Mostrar ubicaciones en el dashboard web con mapa

### Código a Mostrar
- `LocationService.js` - Lógica de rastreo
- `TrackingScreen.js` - Interfaz de usuario
- `AndroidManifest.xml` - Permisos

---

## 📚 Documentación Adicional

Ver `mobile/README.md` para más detalles técnicos.

---

**¡App Móvil lista para cumplir el requisito 4.3.1!** 🎉

