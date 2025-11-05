# 🤖 Cómo Funcionar Bot de Telegram

## 📱 Funcionamiento del Bot de Telegram

El bot de Telegram permite solicitar ubicaciones de manera manual a través de mensajes de chat.

---

## 🚀 Configuración

### 1. Obtener Token del Bot

1. Abre Telegram en tu teléfono o computadora
2. Busca el bot **@BotFather**
3. Envía el comando: `/newbot`
4. Sigue las instrucciones:
   - Da un nombre al bot (ej: "Mi Rastreo Bot")
   - Da un username (debe terminar en "bot", ej: "mi_rastreo_bot")
5. BotFather te dará un **TOKEN** como este:
   ```
   1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
   ```

### 2. Configurar en Railway

1. Ve a Railway Dashboard
2. Selecciona tu servicio Backend
3. Ve a "Variables"
4. Agrega la variable:
   - **Nombre:** `TELEGRAM_BOT_TOKEN`
   - **Valor:** `tu_token_del_paso_anterior`
5. Guarda y espera que redeployee

---

## 📲 Cómo Usar el Bot

### Paso 1: Iniciar Chat con el Bot

1. Busca tu bot en Telegram (por el username que creaste)
2. Click en **"Iniciar"** o envía `/start`
3. El bot te responderá con el menú de comandos

### Paso 2: Vincular tu Número

Envía:
```
/link +573143568097
```

El bot confirmará:
```
✅ Vinculado con número: +573143568097
```

### Paso 3: Solicitar Ubicación

Envía:
```
/location
```

O simplemente usa el botón de menúes que aparece.

### Paso 4: Enviar Ubicación

1. Telegram mostrará un botón "📍 Compartir ubicación"
2. Click en ese botón
3. Elige tu ubicación actual
4. Envía

### Paso 5: Confirmación

El bot confirmará:
```
✅ Ubicación recibida:
Lat: 4.6097
Lng: -74.0817
```

---

## 🎯 Comandos del Bot

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `/start` | Iniciar bot | `/start` |
| `/help` | Ver ayuda | `/help` |
| `/location` | Solicitar ubicación | `/location` |
| `/link <numero>` | Vincular número | `/link +573143568097` |
| `/status` | Ver estado vinculado | `/status` |

---

## 💬 Funcionalidades

### 1. Solicitar Ubicación (Manual)

El usuario puede enviar su ubicación cuando quiera.

**Flujo:**
```
Usuario → /location
Bot → "Envia tu ubicación"
Usuario → Envía ubicación GPS
Bot → Confirma recepción
```

### 2. Vinculación con Número Telefónico

Cada usuario se vincula con su número.

**Propósito:**
- Identificar quién envió la ubicación
- Guardar el número para tracking
- Relacionar con dispositivos en el sistema

### 3. Menús Interactivos

El bot muestra botones y menús para facilitar el uso.

---

## 🔄 Integración con el Sistema

### Conexión con Backend

El bot se conecta con tu backend:

```
Telegram → Bot → Backend API → Base de Datos
```

### Flujo Completo

1. **Usuario envia ubicación**
2. Bot recibe coordenadas GPS
3. Bot consulta a Nominatim (geocodificación inversa)
4. Bot devuelve respuesta con dirección
5. **(Futuro)**: Bot guarda ubicación en backend

---

## 📝 Archivo del Bot

**Ubicación:** `backend/src/bot/telegramBot.js`

**Funciones principales:**
- `init()` - Inicializar bot con token
- `handleMessage()` - Manejar comandos de texto
- `handleLocation()` - Manejar ubicaciones recibidas
- `requestLocation()` - Solicitar ubicación a un chat
- `isReady()` - Verificar si el bot está funcionando

---

## 🧪 Probar el Bot

### Modo Desarrollo (Local)

```bash
cd backend
# Agregar token en .env
echo "TELEGRAM_BOT_TOKEN=tu_token_aqui" >> .env

# Iniciar backend
npm start
```

### Modo Producción (Railway)

1. Agregar `TELEGRAM_BOT_TOKEN` en variables de entorno
2. Railway redeployea automáticamente
3. El bot inicia y escucha mensajes

---

## ✅ Ventajas del Bot de Telegram

1. ✅ **No requiere app adicional** - Usa Telegram que ya tienen
2. ✅ **Fácil de usar** - Solo mensajes y botones
3. ✅ **Instantáneo** - Respuesta inmediata
4. ✅ **Menús interactivos** - Mejor UX
5. ✅ **Gratis** - No requiere pago
6. ✅ **Disponible 24/7** - Siempre respondiendo

---

## ⚠️ Limitaciones

1. ⚠️ **Requiere intervención manual** - El usuario debe enviar ubicación
2. ⚠️ **No es automático** - No rastrea en segundo plano
3. ⚠️ **Requiere Telegram instalado** - Dependencia de la app

---

## 🎓 Ejemplo de Conversación

```
Usuario: /start
Bot: ¡Hola! 👋 Bienvenido al bot de Rastreo App...

Usuario: /link +573143568097
Bot: ✅ Vinculado con número: +573143568097

Usuario: /location
Bot: 📍 Por favor, comparte tu ubicación actual...

Usuario: [Envía ubicación GPS]
Bot: ✅ Ubicación recibida:
     Lat: 4.6097
     Lng: -74.0817
     🏠 Calle 26, Bogotá
     12/01/2024 4:57 PM
```

---

## 🔗 Integración Futura

Para guardar las ubicaciones en el backend:

1. El bot debe llamar al endpoint: `POST /api/locations`
2. Incluir el `device_id` vinculado
3. Enviar coordenadas
4. El sistema guardará la ubicación

**Código actual:** El bot solo confirma recepción, no guarda aún.

---

## 📚 Recursos

- [Documentación de Telegram Bot API](https://core.telegram.org/bots/api)
- [@BotFather](https://t.me/botfather) - Para crear bots
- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) - Biblioteca usada

---

## 🎯 Resumen

**El bot de Telegram:**
- ✅ Recibe comandos de texto
- ✅ Solicita ubicaciones
- ✅ Recibe coordenadas GPS
- ✅ Obtiene direcciones (geocodificación inversa)
- ✅ Responde con confirmaciones
- ⚠️ **Por ahora NO guarda ubicaciones en BD** (se puede implementar)

**Usa el bot cuando:**
- Necesites ubicación inmediata
- El usuario no tiene la app móvil instalada
- Quieras solicitar ubicación manualmente

