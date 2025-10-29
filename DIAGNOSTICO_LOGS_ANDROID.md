# 🔍 Cómo Ver Los Logs de Android

## 📱 Opción 1: Usando ADB (Recomendado)

### Requisitos:
- Celular conectado a la computadora por USB
- "Depuración USB" habilitada

### Pasos:

1. **Habilita Depuración USB en tu celular:**
   ```
   Configuración → Opciones de desarrollador → Depuración USB (activar)
   ```

2. **Verifica que el celular esté conectado:**
   ```powershell
   adb devices
   ```
   Deberías ver tu dispositivo listado.

3. **Ver los logs filtrados:**
   ```powershell
   adb logcat | Select-String "LocationService|RastreoApp"
   ```

4. **En el celular:**
   - Inicia el rastreo
   - Observa los mensajes en la terminal

### ¿Qué deberías ver?

**Si Funciona:**
```
📤 Enviando ubicación al servidor...
✅ Location sent successfully
```

**Si Hay Error:**
```
❌ Error sending location: { status: 401, message: ... }
```

**Si No Aparece Nada:**
- El rastreo no se está ejecutando realmente

---

## 📱 Opción 2: App de Logs en Android

1. Instala "Log Viewer" desde Google Play
2. Abre la app
3. Filtra por "RastreoApp"
4. Inicia el rastreo en tu app
5. Observa los logs

---

## 🎯 Test Sencillo SIN Logs

Mientras tanto, **haz este test simple:**

1. **En tu celular, cierra completamente la app**
2. **Abrela de nuevo**
3. **Cierra sesión**
4. **Vuelve a iniciar sesión** (importante: reiniciar el token)
5. **Presiona "▶️ INICIAR RASTREO"**
6. **Espera 2 minutos**
7. **Mira los logs de Railway:**

**¿Aparece `POST /api/locations`?**

- ✅ Si aparece → Funcionó, espera a que aparezcan en el frontend
- ❌ Si NO aparece → El código no se está ejecutando

---

## 🆘 Si No Aparece POST en Railway

**Significa que `sendLocationToServer` NO se está ejecutando.**

**Posibles causas:**
1. El rastreo no se está iniciando (checkTracking no funciona)
2. Hay un error antes del envío
3. Los permisos están bloqueando el envío

**Solución temporal:**
- Modifica el intervalo a 1 minuto para testing (en lugar de 10)
- O ejecuta inmediatamente en lugar de esperar

---

## 💡 Próximo Paso

**Ejecuta el test sencillo arriba y dime:**
1. ¿Apareció `POST /api/locations` en los logs de Railway?
2. Si SÍ apareció, ¿qué status code devolvió? (200 = éxito, 401 = token expirado, etc.)
3. Si NO apareció, ¿qué error ves en los logs de Android (si puedes verlos)?

