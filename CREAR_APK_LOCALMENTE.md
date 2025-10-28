# 🚀 Crear APK Localmente con Android Studio

## ✅ Ya tienes Android Studio instalado

Perfecto, ahora podemos compilar la APK directamente en tu computadora.

---

## 📋 Pasos para Compilar APK

### Paso 1: Limpiar y Prebuild

```bash
cd mobile

# Generar archivos nativos de Android correctos
npx expo prebuild --platform android --clean
```

Esto creará la estructura Android completa compatible con Expo.

### Paso 2: Compilar APK

```bash
cd android
./gradlew assembleDebug
```

**En Windows, usa:**
```bash
gradlew.bat assembleDebug
```

### Paso 3: Encontrar el APK

El APK estará en:
```
mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## ⚡ Script Todo-en-Uno

He creado un script que hace todo automáticamente:

```bash
cd mobile
npx expo prebuild --platform android --clean
cd android
gradlew.bat assembleDebug
```

---

## 🎯 Comandos Completos

Ejecuta estos comandos en orden:

```powershell
# 1. Ir a la carpeta mobile
cd mobile

# 2. Generar archivos Android (limpia y regenera)
npx expo prebuild --platform android --clean

# 3. Ir a carpeta android
cd android

# 4. Compilar APK
gradlew.bat assembleDebug

# 5. El APK estará en:
# mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

**Tiempo estimado:** 5-10 minutos (primera vez puede tardar más descargando dependencias)

---

## 📱 Instalar APK en tu Celular

### Opción A: USB

```bash
# Conectar celular por USB
# Activar "Depuración USB" en opciones de desarrollador
adb install mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

### Opción B: Compartir Archivo

1. Copia `app-debug.apk` al celular
2. Abre el archivo en el celular
3. Permite "Instalar desde fuentes desconocidas"
4. Instala la app

---

## ⚠️ Si Hay Errores

### Error: "expo: command not found"

```bash
npm install -g expo-cli
```

### Error: "gradlew: command not found"

```bash
cd mobile/android
gradlew.bat assembleDebug
# O en Git Bash:
./gradlew assembleDebug
```

### Error: "SDK location not found"

Configura la variable de entorno `ANDROID_HOME`:
```powershell
# Verificar Android SDK instalado en:
C:\Users\$env:USERNAME\AppData\Local\Android\Sdk

# Agregar al PATH:
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\platform-tools"
```

---

## ✅ Resultado Esperado

Después de compilar exitosamente:

✅ APK generado en: `mobile/android/app/build/outputs/apk/debug/app-debug.apk`  
✅ Tamaño: ~30-50 MB  
✅ Compatible: Android 6.0+  
✅ Lista para instalar en tu celular

---

## 🎉 ¡Ejecuta Esto Ahora!

```powershell
cd mobile
npx expo prebuild --platform android --clean
cd android
gradlew.bat assembleDebug
```

**¡Vamos!** 🚀

