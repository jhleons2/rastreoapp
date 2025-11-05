# 📱 Guía para Generar APK - Aplicación Móvil

Esta guía te mostrará cómo compilar la aplicación móvil de RastreoApp en un archivo APK instalable.

## 📋 Requisitos

- **Android Studio** (recomendado) o línea de comandos
- **Java JDK** 11 o superior
- **Node.js** 18+
- **npm** o **yarn**
- **Proyecto mobile** del repositorio

## 🎯 Método 1: Con Android Studio (Recomendado)

### Paso 1: Instalar Android Studio

1. Descarga desde: https://developer.android.com/studio
2. Instala Android Studio
3. Abre Android Studio
4. Instala componentes necesarios:
   - Android SDK
   - Android SDK Platform 33
   - Android SDK Build-Tools

### Paso 2: Abrir el Proyecto

1. Abre Android Studio
2. Click en **"Open"**
3. Navega a `mobile/android`
4. Click en **"OK"**
5. Espera a que Gradle sincronice (puede tomar varios minutos)

### Paso 3: Configurar API URL

Antes de compilar, asegúrate de que la URL de la API sea correcta:

```javascript
// Edita: mobile/src/config/api.js
const API_URL = 'https://rastreoapp-production.up.railway.app/api';
// O tu URL personalizada
```

### Paso 4: Compilar APK de Debug

**Opción A: Desde el menú**

1. Build → Build Bundle(s) / APK(s) → Build APK(s)
2. Espera a que compile (5-10 minutos primera vez)
3. Cuando termine, verás: "APK(s) generated successfully"
4. Click en **"locate"** para abrir la carpeta

**Opción B: Desde terminal integrada**

```bash
cd android
./gradlew assembleDebug
```

### Paso 5: Ubicar el APK

El APK estará en:
```
mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

## 🖥️ Método 2: Desde Línea de Comandos

### Paso 1: Instalar Dependencias

```bash
cd mobile
npm install
```

### Paso 2: Configurar Variables

Edita `mobile/src/config/api.js` con tu URL de API.

### Paso 3: Compilar

**En Windows:**
```bash
cd android
gradlew.bat assembleDebug
```

**En macOS/Linux:**
```bash
cd android
./gradlew assembleDebug
```

### Paso 4: Ubicar APK

```
mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

## 🚀 Método 3: APK Release (Producción)

Para generar un APK optimizado y firmado para producción:

### Paso 1: Generar Keystore

```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore rastreo-release-key.keystore \
  -alias rastreo-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000
```

Guarda la contraseña en un lugar seguro.

### Paso 2: Configurar Gradle

Crea `mobile/android/gradle.properties`:

```properties
RASTREO_RELEASE_STORE_FILE=rastreo-release-key.keystore
RASTREO_RELEASE_KEY_ALIAS=rastreo-key-alias
RASTREO_RELEASE_STORE_PASSWORD=tu_password
RASTREO_RELEASE_KEY_PASSWORD=tu_password
```

Edita `mobile/android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('RASTREO_RELEASE_STORE_FILE')) {
                storeFile file(RASTREO_RELEASE_STORE_FILE)
                storePassword RASTREO_RELEASE_STORE_PASSWORD
                keyAlias RASTREO_RELEASE_KEY_ALIAS
                keyPassword RASTREO_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Paso 3: Compilar Release

```bash
cd android
./gradlew assembleRelease
```

APK en: `mobile/android/app/build/outputs/apk/release/app-release.apk`

## 📦 Método 4: Con EAS Build (Expo)

### Paso 1: Instalar EAS CLI

```bash
npm install -g eas-cli
```

### Paso 2: Login en Expo

```bash
cd mobile
eas login
```

### Paso 3: Configurar Proyecto

```bash
eas build:configure
```

Selecciona Android cuando se pregunte.

### Paso 4: Compilar en la Nube

```bash
eas build --platform android --profile preview
```

Espera a que compile (15-30 minutos). Recibirás un link de descarga.

## 🔧 Solución de Problemas

### Error: "SDK location not found"

**Solución**: Crea `mobile/android/local.properties`:

```properties
sdk.dir=C:\\Users\\TuUsuario\\AppData\\Local\\Android\\Sdk
# En macOS/Linux:
# sdk.dir=/Users/TuUsuario/Library/Android/sdk
```

### Error: "Gradle version mismatch"

**Solución**: Actualiza Gradle:

```bash
cd android
./gradlew wrapper --gradle-version=8.0.2
```

### Error: "Java version incorrect"

**Solución**: Instala Java JDK 11:

```bash
# Verifica versión
java -version

# Descarga JDK 11: https://adoptium.net/
```

### Error: "Out of memory"

**Solución**: Aumenta memoria de Gradle en `mobile/android/gradle.properties`:

```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m
```

### Compilación muy lenta

**Solución**: Habilita Gradle Daemon:

```properties
# En gradle.properties
org.gradle.daemon=true
org.gradle.parallel=true
org.gradle.configureondemand=true
```

## ✅ Verificar APK

### Instalar en Dispositivo por USB

1. Conecta tu teléfono Android por USB
2. Activa **Depuración USB** en opciones de desarrollador
3. Ejecuta:

```bash
adb install mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

### Instalar Manualmente

1. Copia el APK a tu teléfono
2. Abre el APK desde el explorador de archivos
3. Permite "Instalar apps de origen desconocido"
4. Click en **"Instalar"**

## 📊 Tamaños Típicos

- **APK Debug**: ~80-100 MB
- **APK Release**: ~50-60 MB (con ProGuard)
- **APK Release (split)**: ~30-40 MB por arquitectura

## 🎨 Personalizar App

### Cambiar Nombre de la App

Edita `mobile/android/app/src/main/res/values/strings.xml`:

```xml
<string name="app_name">RastreoApp</string>
```

### Cambiar Icono

Reemplaza los iconos en:
```
mobile/android/app/src/main/res/
├── mipmap-hdpi/ic_launcher.png
├── mipmap-mdpi/ic_launcher.png
├── mipmap-xhdpi/ic_launcher.png
├── mipmap-xxhdpi/ic_launcher.png
└── mipmap-xxxhdpi/ic_launcher.png
```

### Cambiar Package Name

1. Edita `mobile/android/app/build.gradle`:
```gradle
android {
    defaultConfig {
        applicationId "com.tuempresa.rastreoapp"
    }
}
```

2. Renombra los paquetes Java en `mobile/android/app/src/main/java/`

## 🚀 Distribución

### Google Play Store

1. Genera APK Release firmado
2. Crea cuenta de desarrollador en Google Play Console
3. Sube el APK
4. Completa la información de la app
5. Publica

### Distribución Directa

1. Sube el APK a tu servidor web
2. Comparte el link de descarga
3. Los usuarios deben activar "Orígenes desconocidos"

## 📝 Notas Importantes

- El APK de **debug** es solo para pruebas (más grande, sin optimizar)
- El APK de **release** debe usarse en producción (optimizado, firmado)
- Nunca compartas tu keystore o contraseñas
- Guarda backups del keystore (sin él no puedes actualizar la app)
- El APK de debug usa un certificado auto-firmado temporal

## 🔗 Scripts Útiles

Agrega estos scripts a `mobile/package.json`:

```json
{
  "scripts": {
    "android:build": "cd android && ./gradlew assembleDebug",
    "android:build:release": "cd android && ./gradlew assembleRelease",
    "android:install": "cd android && ./gradlew installDebug",
    "android:clean": "cd android && ./gradlew clean"
  }
}
```

Usa con: `npm run android:build`

## 📚 Recursos Adicionales

- [Documentación React Native](https://reactnative.dev/docs/signed-apk-android)
- [Documentación Expo](https://docs.expo.dev/build/setup/)
- [Guía de Gradle](https://gradle.org/guides/)
- [Guía de Android Studio](https://developer.android.com/studio/build)

---

**¡APK compilado exitosamente! 🎉**

Ahora puedes instalar la app en cualquier dispositivo Android.

