# ⚠️ Error: Railway Detecta "Java"

## 🔍 Problema

Railway está detectando el proyecto como **Java** en vez de **Node.js**

Esto significa que:
- ❌ No está usando la carpeta `frontend/`
- ❌ Está desplegando desde la raíz del proyecto
- ❌ No puede encontrar el código React

---

## ✅ SOLUCIÓN

### PASO 1: Configurar Root Directory en Railway

En Railway Dashboard:

1. Ve a **rastreoapp-frontend** (tu servicio)
2. Click en **Settings**
3. Busca **"Root Directory"**
4. **ESCRIBE:** `frontend`
5. Click en **Save**

### PASO 2: Verificar Build Commands

En **Settings** → **"Build & Deploy"**:

- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

### PASO 3: Redeploy

1. Ve a **Deployments**
2. Click en **"..."** del último deployment
3. Click en **"Redeploy"**
4. Espera 3-5 minutos

### PASO 4: Verificar en Logs

En **Logs**, deberías ver:

```
✓ Installed
✓ Built in XXms
```

**NO deberías ver:**
- ❌ "Java"
- ❌ "Building with Java"

---

## 🎯 Resultado Esperado

Después del redeploy con "Root Directory" = `frontend`:

1. Railway detectará **"Node.js"** en vez de "Java"
2. Desplegará el frontend React correctamente
3. En Logs verás: "vite build"

---

## 🚀 Alternativa: Usar Local

Mientras arreglas Railway, puedes usar el frontend local:

```powershell
# Mantén esta terminal abierta:
cd frontend
npm run dev
```

Luego abre: **http://localhost:3000**

**Funcionará perfectamente para tu demo/presentación.**

---

¿Configuraste "Root Directory" como "frontend" en Railway?

