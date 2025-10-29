# 🚀 Cómo Generar APK con Android Studio

## 📋 Requisitos Previos

- ✅ Android Studio instalado
- ✅ Java JDK instalado
- ✅ Proyecto mobile configurado con Expo

## 🔧 Paso 1: Crear Assets Básicos

Primero necesitamos crear iconos básicos para la app. Crea estos archivos en la carpeta `mobile/assets/`:

### Archivos Necesarios:
- `icon.png` - 1024x1024 px (icono principal)
- `adaptive-icon.png` - 1024x1024 px (icono adaptativo para Android)
- `splash.png` - 1242x2436 px (pantalla de inicio)
- `favicon.png` - 48x48 px (para web)

**Solución rápida:** Puedes crear imágenes temporales básicas o usar:
- https://www.flaticon.com para iconos
- https://www.remove.bg para fondos transparentes

## 🔨 Paso 2: Compilar el APK con Android Studio

### Opción A: Compilar desde Android Studio (Recomendado)

1. **Abrir el proyecto en Android Studio:**
   ```bash
   cd mobile
   # Abre Android Studio y selecciona "Open" -> elige la carpeta "android"
   ```

2. **Configurar el proyecto:**
   - Ve a `android/local.properties` y configura:
     ```properties
     sdk.dir=C:\\Users\\JHON LEON\\AppData\\Local\\Android\\Sdk
     ```

3. **Build APK:**
   - En Android Studio: `Build` > `Build Bundle(s) / APK(s)` > `Build APK(s)`
   - O desde terminal:
     ```bash
     cd android
     ./gradlew assembleDebug
     ```

4. **Ubicación del APK:**
   - El APK se generará en: `mobile/android/app/build/outputs/apk/debug/app-debug.apk`

### Opción B: Generar APK directamente desde Terminal

```bash
cd mobile/android
gradlew.bat assembleDebug
```

El APK estará en: `mobile/android/app/build/outputs/apk/debug/app-debug.apk`

## 📱 Paso 3: Instalar el APK en tu Android

### Método 1: USB
1. Habilita "Depuración USB" en tu Android
2. Conecta el celular por USB
3. Ejecuta: `adb install app-debug.apk`

### Método 2: Archivo
1. Copia `app-debug.apk` al celular
2. Abre el archivo desde el administrador de archivos
3. Permite "Instalar apps de fuentes desconocidas" si es necesario
4. Instala

## ⚠️ Solución de Problemas

### Error: "ENOENT: no such file or directory, open 'assets/adaptive-icon.png'"

**Solución:** Crea los archivos de assets faltantes:

```bash
cd mobile
mkdir -p assets
# Crea las imágenes necesarias o baja templates de Expo
```

### Error: "SDK location not found"

**Solución:** Edita `mobile/android/local.properties`:
```properties
sdk.dir=C:\\Users\\TU_USUARIO\\AppData\\Local\\Android\\Sdk
```

### Error: Gradle build failed

**Solución:**
```bash
cd mobile/android
gradlew.bat clean
gradlew.bat assembleDebug
```

## 🎯 Alternativa Rápida: Expo Go

Si necesitas probar rápidamente sin generar APK:

```bash
cd mobile
npm start
# Escanea el QR con Expo Go app (disponible en Play Store)
```

## 📝 Notas Importantes

- El APK debug es para testing, no para producción
- Para producción, necesitas firmar el APK
- El APK debug expira después de 7 días de instalación
- Actualiza la URL del backend en `mobile/src/config/api.js`

## 🔗 Links Útiles

- Expo Docs: https://docs.expo.dev/
- Android Studio: https://developer.android.com/studio
- React Native: https://reactnative.dev/

