# 🚀 Generar APK Ahora - Pasos Rápidos

## 📋 Opción 1: Usar Android Studio (MÁS FÁCIL)

### Paso 1: Abrir Android Studio
1. Abre Android Studio en tu computadora

### Paso 2: Importar el Proyecto
1. En Android Studio: `File` > `Open`
2. Navega a: `C:\Users\JHON LEON\Documents\Universidad\Redes 2\Taller2\mobile\android`
3. Selecciona la carpeta `android` y haz clic en "OK"
4. Espera a que Android Studio sincronice el proyecto (descargará dependencias automáticamente)

### Paso 3: Generar el APK
1. En la barra superior: `Build` > `Build Bundle(s) / APK(s)` > `Build APK(s)`
2. Espera a que termine la compilación (verás un progreso en la parte inferior)
3. Cuando termine, aparecerá una notificación: "Build completed successfully"
4. Haz clic en "locate" para abrir la carpeta del APK

### Paso 4: Obtener el APK
El APK estará en:
```
mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

### Paso 5: Instalar en tu Android
1. Conecta tu celular por USB
2. Copia el archivo `app-debug.apk` a tu celular
3. Abre el archivo desde el celular
4. Permite "Instalar apps de fuentes desconocidas" si se solicita
5. Instala la app

---

## 📋 Opción 2: Compilar desde la Terminal (REQUIERE JAVA)

### Si tienes Java instalado:

```powershell
cd mobile/android
.\gradlew.bat assembleDebug
```

El APK estará en: `mobile/android/app/build/outputs/apk/debug/app-debug.apk`

### Si NO tienes Java:

Debes instalar Java primero:
1. Descarga desde: https://www.oracle.com/java/technologies/downloads/
2. Instala Java JDK 17
3. Configura JAVA_HOME en variables de entorno
4. Luego ejecuta el comando de arriba

---

## 📱 Qué hacer después de instalar el APK:

1. **Abrir la app** en tu celular
2. **Registrarse o iniciar sesión:**
   - Usa las credenciales que creaste en el frontend web
3. **Permitir permisos de ubicación:**
   - La app pedirá permisos de GPS
   - Debes aceptar para que funcione
4. **Iniciar rastreo:**
   - Presiona el botón "Iniciar Rastreo"
   - La app enviará tu ubicación cada 10 minutos automáticamente
5. **Verificar en el frontend:**
   - Ve a https://rastreoapp-frontend-production.up.railway.app/locations
   - Selecciona tu dispositivo
   - Deberías ver tu ubicación en el mapa

---

## ⚠️ Si tienes problemas:

### Android Studio no encuentra el proyecto:
- Asegúrate de abrir la carpeta `android`, NO la carpeta `mobile`

### Error de compilación en Android Studio:
- Ve a `File` > `Invalidate Caches / Restart` > `Invalidate and Restart`
- Espera a que Android Studio reinicie
- Intenta compilar nuevamente

### El APK no se instala en el celular:
- Verifica que permitiste "Instalar apps de fuentes desconocidas"
- Prueba reinstalar la app
- Desinstala versiones anteriores primero

### La app no obtiene ubicación:
- Verifica que los permisos de ubicación estén habilitados
- Revisa en Configuración del celular > Apps > RastreoApp > Permisos
- Asegúrate de usar "Permitir siempre" para rastreo en segundo plano

---

## 🎯 Resumen Rápido

1. Abre Android Studio
2. Open > `mobile/android`
3. Build > Build APK(s)
4. Encuentra el APK en la carpeta de salida
5. Copia a tu celular e instala
6. Abre la app y registra/inicia sesión
7. ¡Listo! Tu ubicación se enviará automáticamente

