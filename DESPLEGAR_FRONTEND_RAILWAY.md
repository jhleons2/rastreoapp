# 🚂 Desplegar Frontend en Railway

## 📋 Configuración Requerida

### PASO 1: Crear Servicio de Frontend en Railway

1. Ve a Railway Dashboard
2. Click en tu proyecto "rastreoapp"
3. Click en "+ New" → "Empty Service"
4. Nombra el servicio: `rastreoapp-frontend`
5. Connect a GitHub: selecciona tu repositorio

### PASO 2: Configurar Variables de Entorno

En el servicio `rastreoapp-frontend`:

1. Ve a **Variables**
2. Agrega:
   ```
   VITE_API_URL=https://rastreoapp-production.up.railway.app
   ```

### PASO 3: Configurar Root Directory

1. Ve a **Settings** → **Root Directory**
2. Cambia a: `frontend`

### PASO 4: Configurar Build y Deploy

1. Ve a **Settings** → **Build & Deploy**
2. Build Command: `npm install && npm run build`
3. Start Command: `npm start`

---

## 🏗️ Configuración Adicional

### Crear `frontend/railway.json` (ya incluido)

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Crear `frontend/nixpacks.toml` (opcional)

```toml
[phases.setup]
nixPkgs = ['nodejs-18_x']

[phases.install]
cmds = ['npm ci']

[phases.build]
cmds = ['npm run build']

[start]
cmd = 'npm start'
```

---

## ✅ Verificar Deployment

### 1. Ver Logs

Railway → rastreoapp-frontend → **Logs**

Deberías ver:
```
VITE_API_URL=https://rastreoapp-production.up.railway.app
✓ Built in XXms
```

### 2. Generar Dominio

1. Railway → rastreoapp-frontend → **Settings**
2. Click en **"Generate Domain"**
3. Copia la URL (ej: `rastreoapp-frontend.railway.app`)

### 3. Probar

Abre la URL en el navegador:
```
https://rastreoapp-frontend.railway.app
```

Deberías ver la página de Login.

---

## 🎯 Flujo Completo

```
Usuario → Frontend (Railway) → API (Railway) → PostgreSQL (Railway)
```

Todos los servicios están en Railway:
- ✅ Backend API: rastreoapp-production.up.railway.app
- ✅ Frontend: rastreoapp-frontend.railway.app (por crear)
- ✅ PostgreSQL: configurado

---

## 🐛 Solución de Problemas

### Error: "Cannot find module"
→ Verifica que `Root Directory` esté configurado en `frontend`

### Error: "VITE_API_URL is not defined"
→ Agrega la variable de entorno en Railway

### Build funciona pero la app no carga
→ Verifica que el puerto sea `3000` en el Start Command

---

## 📊 Arquitectura Final

```
GitHub Repo
    ├── backend/          → rastreoapp (Railway)
    └── frontend/         → rastreoapp-frontend (Railway)
```

Ambos servicios conectados al mismo repositorio GitHub.

