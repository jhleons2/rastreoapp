# 🔧 Generar APK con Logging Mejorado

## ✅ Cambio Realizado

He mejorado el logging en `LocationService.js` para ver exactamente qué error ocurre al enviar ubicaciones.

### Los Logs Ahora Mostrarán:

1. ✅ Intentos de envío de ubicación
2. ❌ Errores detallados (status, mensaje, url)
3. 📤 Confirmación de envío exitoso

---

## 🚀 Generar Nuevo APK

```powershell
cd mobile
npx eas-cli build --platform android --profile preview
```

**Responde "Y" cuando pregunte por el keystore.**

---

## 📱 Después de Instalar el Nuevo APK

### Ver Los Logs en Android:

#### Opción 1: Usando Android Debug Bridge (ADB)

1. Conecta tu celular por USB
2. Habilita "Depuración USB" en Configuración de Desarrollador
3. Abre PowerShell y ejecuta:
   ```powershell
   adb logcat | Select-String "RastreoApp\|LocationService"
   ```
4. Inicia el rastreo en tu celular
5. Observa los logs en la terminal

#### Opción 2: Ver Logs Directamente en el Celular

1. Usa una app como "aLogcat" o "Log Viewer"
2. Filtra por "RastreoApp"
3. Inicia el rastreo
4. Observa los logs

---

## 🔍 Qué Buscar en Los Logs

### ✅ Si Funciona:
```
📤 Enviando ubicación al servidor... { device_id: X, latitude: Y, longitude: Z }
✅ Location sent successfully: { ... }
```

### ❌ Si Hay Error:
```
❌ Error sending location: {
  message: "...",
  status: 401/404/500,
  ...
}
```

**El "status" te dirá el problema:**
- **401** = Token expirado → Cierra sesión y vuelve a iniciar
- **404** = URL incorrecta o endpoint no encontrado
- **500** = Error del servidor
- **Network Error** = Sin conexión o URL incorrecta

---

## 🎯 Después de Ver Los Logs

**Envíame:**
1. ¿Qué mensajes aparecieron cuando iniciaste el rastreo?
2. ¿Aparece el emoji 📤 (intentando enviar)?
3. ¿Qué error aparece? (status, message)

**Con esa información sabré exactamente qué arreglar.** 🔍

---

**¡Genera el nuevo APK y pruébalo!**

