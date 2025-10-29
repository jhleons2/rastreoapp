# Generar APK con Expo (EAS Build)

Tu proyecto ya está configurado para usar **Expo Application Services (EAS)**. Esto significa que puedes generar tu APK sin problemas de Gradle local.

## ✅ Requisitos Previos

- ✅ Tu proyecto ya tiene EAS configurado
- ✅ Tienes EAS CLI instalado (versión 16.25.1)
- ✅ Necesitas una cuenta de Expo (gratuita)

## 🚀 Pasos para Generar el APK

### 1. Inicia Sesión en Expo

```powershell
cd mobile
npx eas-cli login
```

Esto te pedirá:
- Si no tienes cuenta: `Sign up` (usa tu email)
- Si ya tienes cuenta: `Log in` con tu usuario y contraseña

### 2. Construir el APK para Android

Ejecuta uno de estos comandos según necesites:

#### Para Testing (APK Inmediato):
```powershell
npx eas-cli build --platform android --profile preview
```

Este perfil genera un APK que puedes instalar directamente en tu dispositivo.

#### Para Producción (AAB para Google Play):
```powershell
npx eas-cli build --platform android --profile production
```

Este perfil genera un AAB (Android App Bundle) para publicar en Google Play Store.

### 3. Espera la Construcción

- La construcción se hace en la nube (gratis)
- Puedes ver el progreso en tu terminal
- También puedes verlo en: https://expo.dev/accounts/YOUR_USERNAME/projects/rastreoapp/builds

### 4. Descarga el APK

Una vez completada la construcción:
- Recibirás un enlace en la terminal
- O puedes descargarlo desde el dashboard de Expo
- Usa ese enlace para descargar el APK a tu computadora

## 📱 Instalación del APK en tu Dispositivo

1. Transfiere el APK a tu dispositivo Android (por USB, email, etc.)
2. En tu dispositivo, ve a **Configuración → Seguridad → Permite instalación de fuentes desconocidas**
3. Abre el archivo APK desde el explorador de archivos
4. Sigue las instrucciones de instalación

## ⚡ Opción Rápida (Local Build - NO Recomendado debido a errores de Gradle)

Si prefieres construir localmente (pero tendrás los mismos errores de Gradle):

```powershell
npx eas-cli build --platform android --profile preview --local
```

**⚠️ NO RECOMENDADO** por los problemas de Gradle que ya experimentaste.

## 🔧 Ventajas de EAS Build (Nube)

✅ **Sin configuración de Gradle local** - Todo se hace en la nube
✅ **Sin problemas de compatibilidad Java/Gradle** - Expo usa servidores optimizados
✅ **Más rápido** - No necesitas descargar dependencias pesadas
✅ **Gratuito para proyectos personales** - 30 builds gratuitos por mes
✅ **APK listo para instalar** - Sin pasos adicionales

## 📊 Monitoreo de Builds

Puedes ver el estado de tus builds en:
- Terminal: Verás los logs en tiempo real
- Web: https://expo.dev

## 🆘 Solución de Problemas

### Si te pide autenticación:
```powershell
npx eas-cli whoami
```

### Si no estás autenticado:
```powershell
npx eas-cli login
```

### Si necesitas actualizar la configuración:
Edita `mobile/app.json` o `mobile/eas.json` según necesites.

### Ver credenciales Android:
```powershell
npx eas-cli credentials
```

## 📝 Notas Importantes

1. **Primera vez**: Necesitarás configurar las credenciales de Android (Expo lo hará automáticamente)
2. **Package name**: Tu app usa `com.rastreo.app` (ya configurado en app.json)
3. **Permisos**: Ya están configurados (ubicación, etc.)
4. **Tiempo**: El build toma aproximadamente 10-15 minutos

## 🎯 Comando Recomendado para Empezar

```powershell
# En el directorio mobile
npx eas-cli build --platform android --profile preview
```

Este es el comando más simple para generar un APK de prueba listo para instalar.

