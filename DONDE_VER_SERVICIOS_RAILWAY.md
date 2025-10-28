# 📍 Cómo Ver los Servicios en Railway

## 🎯 Ubicación de los Servicios

### En Railway Dashboard:

1. **Ve a:** https://railway.app/dashboard
2. **Click en tu proyecto:** `rastreoapp`
3. **Deberías ver una lista de servicios:**

```
┌─────────────────────────────────────────┐
│  rastreoapp (Proyecto)                   │
├─────────────────────────────────────────┤
│                                          │
│  🚂 Servicios:                          │
│                                          │
│   1. rastreoapp (Backend)               │
│   2. rastreoapp-frontend (Frontend)     │
│   3. Postgres (Base de datos)           │
│                                          │
└─────────────────────────────────────────┘
```

---

## 🔍 Si NO Ves el Servicio `rastreoapp-frontend`

### Significa que NO lo has creado todavía

**Solución:** Crear el servicio

### PASO 1: Crear Servicio Vacío

1. En Railway Dashboard → `rastreoapp`
2. Click en **"+ New"** (botón azul)
3. Selecciona **"Empty Service"**
4. Nombra: `rastreoapp-frontend`

### PASO 2: Conectar a GitHub

1. Click en **"Settings"**
2. Click en **"Connect GitHub"**
3. Selecciona tu repositorio: `rastreoapp`
4. Configura:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

### PASO 3: Agregar Variable

1. **Variables** → **"New Variable"**
2. Name: `VITE_API_URL`
3. Value: `https://rastreoapp-production.up.railway.app`
4. Save

### PASO 4: Deploy

1. Ve a **Deployments**
2. Click en **"..."** → **"Redeploy"**
3. Espera 3-5 minutos
4. En **Settings** → **Networking** → **Generate Domain**

---

## 🎯 Verificación

En la vista de proyecto de Railway deberías ver:

```
📦 rastreoapp
  ├── 🚂 rastreoapp (Backend - verde)
  ├── 🚂 rastreoapp-frontend (Frontend - por crear)
  └── 🗄️ Postgres (Base de datos)
```

---

## ⚡ Alternativa Rápida

Como el frontend ya funciona localmente, puedes seguir usándolo en local:

```powershell
cd "C:\Users\JHON LEON\Documents\Universidad\Redes 2\Taller2\frontend"
npm run dev
```

Luego abres: **http://localhost:3000**

**¿Ves el servicio rastreoapp-frontend en tu proyecto Railway?**

