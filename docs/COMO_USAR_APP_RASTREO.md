# 📱 Cómo Usar la App de Rastreo

## 🔍 Por Qué No Aparece la Ubicación en el Frontend

### Pasos para Verificar:

### 1️⃣ **Verificar en el Celular**

#### Iniciar Rastreo en la App Móvil:
1. Abre la aplicación en tu celular Android
2. **Inicia sesión** con tu cuenta
3. **Presiona el botón "▶️ INICIAR RASTREO"**
4. **Acepta los permisos de ubicación** cuando te los solicite
5. Deberías ver un mensaje: "Rastreo Iniciado - Tu ubicación se enviará automáticamente cada 10 minutos"

#### Verificar que el Rastreo Esté Activo:
- El estado debe mostrar: **"RASTREO ACTIVO"** (en verde)
- Debe aparecer tu ubicación actual (latitud, longitud)
- La precisión debe mostrarse en metros

#### ⚠️ Si NO aparece "RASTREO ACTIVO":
1. Ve a **Configuración → Apps → RastreoApp**
2. Haz clic en **Permisos**
3. Asegúrate de que **Ubicación** esté permitida (incluyendo en segundo plano)
4. Vuelve a la app y reinicia el rastreo

---

### 2️⃣ **Verificar en el Frontend Web**

#### Ver las Ubicaciones:
1. Abre el frontend en tu navegador: https://rastreoapp-frontend.up.railway.app
2. Inicia sesión (misma cuenta que en el celular)
3. Ve a la sección **"Ubicaciones"** en el menú lateral
4. Selecciona tu dispositivo en el dropdown
5. **Las ubicaciones deberían aparecer en el mapa**

#### ⚠️ Si NO aparecen ubicaciones:
- **Espera 10 minutos** después de iniciar el rastreo (el primer envío es inmediato, luego cada 10 min)
- Verifica que el rastreo esté activo en el celular
- Verifica que tengas conexión a internet en el celular

---

### 3️⃣ **Diagnóstico Rápido**

#### En el Celular (App):
- ✅ ¿Está iniciado el rastreo? (debe mostrar "RASTREO ACTIVO")
- ✅ ¿Hay permisos de ubicación? (Configuración → Apps → RastreoApp)
- ✅ ¿Hay conexión a internet?
- ✅ ¿Puedes ver tu ubicación actual en la app?

#### En el Frontend Web:
- ✅ ¿Estás usando la misma cuenta que en el celular?
- ✅ ¿Seleccionaste el dispositivo correcto?
- ✅ ¿Pasaron al menos 1-2 minutos desde que iniciaste el rastreo?

---

### 4️⃣ **Flujo Completo Esperado**

```
1. Celular: Abres app → Inicias sesión
2. Celular: Presionas "INICIAR RASTREO"
3. Celular: Aceptas permisos de ubicación
4. Celular: Verás "RASTREO ACTIVO" ✅
5. App: Envía ubicación inmediatamente al servidor
6. Espera 10 minutos para la siguiente ubicación
7. Frontend: Actualiza la página de Ubicaciones
8. Frontend: Deberías ver tu ubicación en el mapa 📍
```

---

### 5️⃣ **Solución de Problemas**

#### Problema: No aparece ubicación en el frontend

**Causas Posibles:**
1. ❌ El rastreo no está activo en el celular
2. ❌ No hay permisos de ubicación
3. ❌ No hay conexión a internet
4. ⏰ No ha pasado suficiente tiempo (espera al menos 2 minutos)
5. ❌ El dispositivo no está registrado correctamente

**Soluciones:**
- Revisa todos los pasos anteriores
- Reinicia el rastreo en el celular
- Cierra y vuelve a abrir la app
- Actualiza la página del frontend (F5)

#### Problema: El botón no funciona
- Verifica que estés logueado
- Asegúrate de tener permisos de ubicación
- Verifica tu conexión a internet

---

### 6️⃣ **Configuración de Permisos en Android**

#### Permisos Necesarios:
```
✅ Ubicación precisa
✅ Ubicación aproximada
✅ Ubicación en segundo plano (importante para que siga funcionando)
✅ Notificaciones (opcional pero recomendado)
```

#### Cómo Habilitarlos:
```
Configuración → Apps → RastreoApp → Permisos → Ubicación
- Activa "Permitir todo el tiempo"
- También activa "Usar ubicación precisa"
```

---

### 7️⃣ **Frecuencia de Envío**

La app envía la ubicación:
- ⚡ **Inmediatamente** al iniciar el rastreo
- ⏰ **Cada 10 minutos** mientras el rastreo esté activo
- ⚠️ **NO envía** si el celular está apagado o sin internet

---

### 8️⃣ **Comprobar que Funciona**

#### ✅ Señales de que Todo Funciona:
1. En el celular ves "RASTREO ACTIVO"
2. En el celular ves tu ubicación actual
3. Pasados 2 minutos, ves tu ubicación en el mapa del frontend
4. El punto en el mapa corresponde a tu ubicación real
5. Cada 10 minutos aparece una nueva ubicación en el historial

---

## 🆘 Ayuda Adicional

Si después de seguir todos estos pasos NO aparece la ubicación:

1. **Revisa los logs del backend** en Railway
2. **Verifica que el backend esté funcionando** correctamente
3. **Comprueba la URL del API** en `mobile/src/config/api.js`
4. **Verifica que el token esté válido** en ambos dispositivos

---

**¡Con estos pasos deberías ver tu ubicación en el mapa!** 🗺️📍

