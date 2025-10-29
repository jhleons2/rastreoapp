# 🔧 Configurar Java y Compilar APK

## ⚠️ Problema Detectado

El error `JAVA_HOME is not set` indica que Java no está configurado correctamente en tu sistema.

## 🛠️ Solución Paso a Paso

### Paso 1: Verificar si Java está instalado

```powershell
java -version
```

Si Java NO está instalado, instálalo:

### Paso 2: Instalar Java JDK

1. Descarga Java JDK desde: https://www.oracle.com/java/technologies/downloads/
   - Recomendado: Java JDK 17 (LTS)
   - Para Windows: descarga el archivo `.msi` (Windows x64 Installer)

2. Ejecuta el instalador y sigue las instrucciones

### Paso 3: Configurar JAVA_HOME

#### Opción A: Desde PowerShell (Temporal)

```powershell
$env:JAVA_HOME="C:\Program Files\Java\jdk-17"
$env:PATH="$env:JAVA_HOME\bin;$env:PATH"
```

#### Opción B: Configurar Permanente (Recomendado)

1. Presiona `Win + R`, escribe `sysdm.cpl` y presiona Enter
2. Ve a la pestaña "Opciones avanzadas"
3. Haz clic en "Variables de entorno"
4. En "Variables del sistema", haz clic en "Nuevo"
5. Nombre de variable: `JAVA_HOME`
6. Valor: `C:\Program Files\Java\jdk-17` (ajusta según tu versión)
7. Edita la variable `Path` y agrega: `%JAVA_HOME%\bin`
8. Reinicia PowerShell

### Paso 4: Verificar Instalación

```powershell
java -version
```

Deberías ver algo como:
```
openjdk version "17.0.x"
```

### Paso 5: Compilar el APK

```powershell
cd mobile/android
.\gradlew.bat assembleDebug
```

### Paso 6: Ubicar el APK

El APK estará en:
```
mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

## 🚀 Alternativa Rápida: Usar Android Studio

Si tienes problemas con la configuración de Java, usa Android Studio:

1. **Abrir Android Studio**
2. **Abrir el proyecto:**
   - File > Open
   - Selecciona la carpeta `mobile/android`
3. **Build APK:**
   - Build > Build Bundle(s) / APK(s) > Build APK(s)
4. **Ubicación del APK:**
   - Click en "locate" cuando termine
   - O navega a: `mobile/android/app/build/outputs/apk/debug/`

## 📱 Instalar el APK en tu Android

### Método 1: USB (ADB)

1. Habilita "Depuración USB" en tu Android:
   - Configuración > Información del teléfono > Toca 7 veces "Número de compilación"
   - Regresa a Configuración > Opciones de desarrollador > Activa "Depuración USB"

2. Conecta tu Android por USB

3. Ejecuta:
```powershell
cd mobile/android/app/build/outputs/apk/debug
adb install app-debug.apk
```

### Método 2: Transferencia Manual

1. Copia `app-debug.apk` al celular (por USB, email, etc.)
2. Abre el archivo desde el administrador de archivos del celular
3. Si aparece: "Instalar aplicaciones de fuentes desconocidas", permite la instalación
4. Completa la instalación

## ✅ Verificación

Una vez instalado el APK:

1. Abre la app "RastreoApp"
2. Registra o inicia sesión con tu cuenta
3. Verifica los permisos de ubicación
4. Inicia el rastreo
5. Verifica en el frontend que las ubicaciones lleguen correctamente

## 📝 Notas Importantes

- El APK DEBUG expira después de 7 días
- Para producción necesitas firmar el APK con un keystore
- Actualiza la URL del backend en `mobile/src/config/api.js` si es necesario
- Asegúrate de que el backend esté en línea y accesible

## 🔗 Comandos Útiles

```powershell
# Verificar Java
java -version

# Compilar APK
cd mobile/android
.\gradlew.bat assembleDebug

# Limpiar build anterior
.\gradlew.bat clean

# Ver logs de Android
adb logcat accompanied
```

