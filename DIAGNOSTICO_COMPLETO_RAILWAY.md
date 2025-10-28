# 🔍 Diagnóstico Completo de Railway

## 📋 Verificaciones Necesarias

### PASO 1: Ver Logs de Backend

En Railway Dashboard → **rastreoapp** (backend):

1. Click en **"Logs"**
2. Busca mensajes de error
3. Copia los últimos 20-30 líneas de log
4. ¿Qué errores ves?

Busca:
- ❌ `Error:`
- ❌ `TypeError:`
- ❌ `ReferenceError:`
- ❌ `Cannot find module:`
- ❌ `ECONNREFUSED` (base de datos)
- ❌ `ENOTFOUND`

### PASO 2: Ver Logs de Frontend

En Railway Dashboard → **rastreoapp-frontend**:

1. Click en **"Logs"**
2. Copia los últimos 20-30 líneas
3. ¿Qué mensajes ves?

Busca:
- ✅ `vite build` (bueno)
- ❌ `Error:` (malo)
- ❌ `npm ci` failing (malo)

### PASO 3: Verificar Health Check

Abre en tu navegador:

```
https://rastreoapp-production.up.railway.app/health
```

**¿Qué responde?**

- ✅ `{"status":"ok","database":"connected"}` → Backend OK
- ❌ `Application failed to respond` → Backend caído
- ❌ `Error connecting to database` → Problema BD
- ❌ 404 → Endpoints no funcionan

---

## 🔧 Problemas Comunes

### ERROR 1: Backend No Responde

**Síntomas:**
- URL /health da error
- "Application failed to respond"

**Posibles causas:**
- Crash del servidor
- Error en el código
- Puerto incorrecto
- Memoria insuficiente

### ERROR 2: Frontend Muestra Página Default

**Síntomas:**
- ASCII art de Railway
- "Home of the Railway API"

**Causa:**
- Root Directory NO configurado como `frontend`
- Build commands incorrectos

### ERROR 3: Base de Datos No Conecta

**Síntomas:**
- `/health` dice `"database": "disconnected"`

**Causa:**
- Variables de entorno incorrectas
- DATABASE_URL apunta a dominio interno

---

## 📊 Comparte Esta Información

Para diagnosticar, necesito:

1. **Logs del Backend** (rastreoapp)
2. **Logs del Frontend** (rastreoapp-frontend)
3. **Respuesta de /health** (copia el JSON)
4. **Variables de entorno** (screenshot o lista)

**¿Qué errores ves en los Logs?**

