# ⚙️ Configurar Servicio Frontend Existente en Railway

## ✅ Servicio Identificado

El servicio `rastreoapp-frontend` YA existe en Railway.
URL: `rastreoapp-frontend-production.up.railway.app`

---

## 🔧 Configuración Requerida

### PASO 1: Configurar Root Directory

En Railway Dashboard:

1. Ve a **rastreoapp-frontend-production** (tu servicio)
2. Click en **Settings**
3. Busca **"Service"** → **"Root Directory"**
4. **ESCRIBE:** `frontend`
5. Click en **Save**

### PASO 2: Verificar Build Commands

En **Settings** → **"Build & Deploy"**:

- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

Si no están así, cópialos exactamente como está arriba.

### PASO 3: Agregar Variable de Entorno

En **Variables**:

- Click en **"New Variable"**
- Name: `VITE_API_URL`
- Value: `https://rastreoapp-production.up.railway.app`
- Save

### PASO 4: Redeploy

1. Ve a **Deployments**
2. Click en **"..."** del último deployment
3. Click en **"Redeploy"**
4. **ESPERA 3-5 minutos**

### PASO 5: Verificar

Después del redeploy, abre:

```
https://rastreoapp-frontend-production.up.railway.app
```

**Deberías ver:**
- ✅ Página de LOGIN bonita
- ✅ Gradiente azul/morado
- ✅ Formulario de "Número de Teléfono"

**NO deberías ver:**
- ❌ ASCII art de Railway
- ❌ "Home of the Railway API"

---

## 🚀 Si Quieres Ver Resultados Inmediatos

Mientras esperas el redeploy:

```powershell
cd frontend
npm run dev
```

Abre: **http://localhost:3000**

**Funciona perfectamente en local.**

---

¿Ya configuraste el Root Directory como `frontend` y redesplega?

