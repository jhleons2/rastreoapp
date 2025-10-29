# Generar APK con EAS Build - GUÍA RÁPIDA

## 🎯 Comando para Ejecutar (TODO EN UNO)

Abre PowerShell en el directorio `mobile` y ejecuta:

```powershell
cd mobile
npx eas-cli build --platform android --profile preview
```

## 📋 ¿Qué Esperar?

### 1. Autenticación (Primera Vez)
Si no has iniciado sesión, te pedirá:
```
? Would you like to proceed? Yes
Login with Expo or create account: [usuario de Expo]
Password: [tu contraseña]
```

### 2. Configuración de Credenciales (Primera Vez)
Te preguntará sobre las credenciales de Android:
```
? Credentials are not set up for this project. Set up now? Yes
? How would you like to upload your credentials? Expo handles all credentials, you can still provide overrides
```

### 3. Build en la Nube
- Se subirá tu código a Expo
- Se construirá en sus servidores (10-15 minutos)
- Verás el progreso en tiempo real

### 4. Descarga del APK
Al final verás algo como:
```
Build URL: https://expo.dev/accounts/[usuario]/projects/rastreoapp/builds/[id]
```

Haz clic en ese enlace para descargar el APK.

## ✅ Ventajas de Este Método

- ✅ **Sin errores de Gradle** - Se hace todo en la nube
- ✅ **Sin configuración de Java** - Expo lo maneja
- ✅ **APK listo para instalar** - Sin pasos adicionales
- ✅ **Gratuito** - 30 builds gratis por mes

## 📱 Después de Descargar el APK

1. Transfiere el APK a tu dispositivo Android
2. Activa "Fuentes desconocidas" en tu dispositivo
3. Abre el APK y sigue las instrucciones de instalación

## 🆘 Si Tienes Problemas

### Verificar tu cuenta:
```powershell
npx eas-cli whoami
```

### Iniciar sesión manualmente:
```powershell
npx eas-cli login
```

### Ver status del build:
Puedes ver tus builds en: https://expo.dev/accounts/YOUR_USERNAME/projects/rastreoapp/builds

## 🎯 ¡Eso es Todo!

Ejecuta el comando y espera a que termine. El APK estará listo para instalar.

