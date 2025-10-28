# 🔧 Solución: Error "Error creating build plan with Railpack"

## 🎯 El Problema

Railway no puede detectar automáticamente que es un proyecto Node.js.

## ✅ Solución Paso a Paso

### OPCIÓN 1: Configurar desde el Dashboard (MÁS FÁCIL)

#### 1. Configurar Build Settings

1. Ve a **Settings** de tu servicio
2. Busca la sección **"Build"**
3. Configura:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

#### 2. Agregar Variables

1. Ve a la pestaña **"Variables"**
2. Agrega:
   ```
   NODE_ENV = production
   JWT_SECRET = tu_clave_secreta_aqui
   ```

#### 3. Agregar PostgreSQL

1. En la vista principal (no en settings), haz clic en **"+"** o **"New"**
2. Selecciona **"Database" → "PostgreSQL"**
3. Espera a que se cree

#### 4. Redeploy

1. Ve a **"Deployments"**
2. Click en los **3 puntos (...)**
3. Selecciona **"Redeploy"**

---

### OPCIÓN 2: Usar Railway CLI

```bash
# Desde tu directorio local
cd "c:\Users\JHON LEON\Documents\Universidad\Redes 2\Taller2"

# Si no has hecho link
railway link

# Configurar variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=$(openssl rand -hex 32)

# Especificar el directorio backend
railway up --service backend
```

---

## 🎯 Configuración Correcta del Servicio

En Railway Dashboard, en **Settings** debes tener:

### Source:
- Root Directory: `backend` ✅

### Build:
- Builder: `nixpacks` (o Docker si prefieres)
- Build Command: `npm install`
- Root Directory: `backend`

### Deploy:
- Start Command: `npm start`
- Restart Policy: `ON_FAILURE`

### Variables:
```
NODE_ENV = production
JWT_SECRET = tu_clave_secreta
JWT_EXPIRES_IN = 24h
```

---

## 🚨 Si No Tienes la Opción "Root Directory"

Hay un problema con la conexión del repositorio. Necesitas:

1. En **Settings → Source**
2. Verificar que esté conectado a `jhleons2/rastreoapp`
3. La branch es `main`
4. **Click en "Disconnect" y volver a conectar**

O simplemente eliminar el servicio y crear uno nuevo:
1. Click en los **3 puntos (...)**
2. **Delete Service**
3. Crear nuevo servicio desde GitHub repo
4. Esta vez, **antes del primer deploy**, configura el Root Directory

---

## ✅ Verificación Rápida

Después de configurar, tu estructura en Railway debe verse así:

```
rastreoapp (service)
├── Source: jhleons2/rastreoapp (main)
├── Root Directory: backend
├── Build Command: npm install
├── Start Command: npm start
└── Variables:
    ├── NODE_ENV = production
    ├── JWT_SECRET = ...
    └── (variables de PostgreSQL se agregan automáticamente)
```

---

## 🔄 Hacer Redeploy

1. Ir a **Deployments**
2. Click en **"..."** del deployment fallido
3. **"Redeploy"**
4. Esperar (2-3 minutos)
5. Verificar en Logs que compile correctamente

---

## 📝 Archivos Necesarios en GitHub

Verifica que en tu repo tengas:

```
rastreoapp/
├── backend/
│   ├── package.json ✅
│   ├── railway.json ✅
│   ├── nixpacks.toml ✅
│   └── src/
│       ├── server.js ✅
│       └── config/
│           └── database.js ✅
└── Railway.toml ✅
```

Si tienes todo esto, el problema es solo de configuración en Railway Dashboard.

---

**La clave es configurar el Root Directory como `backend`** 🎯

