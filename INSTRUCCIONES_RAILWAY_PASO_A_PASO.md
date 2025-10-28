# 🚂 Instrucciones Paso a Paso - Railway Dashboard

## 🎯 Configuración en Railway Dashboard

### PASO 1: Configurar Root Directory ⭐

En la sección **"Source"** que estás viendo:

1. Haz clic en **"Add Root Directory"**
2. Escribe: `backend`
3. Presiona Enter o haz clic fuera

Esto le dice a Railway que el código está en la carpeta `backend/`

---

### PASO 2: Agregar Base de Datos PostgreSQL

1. En el menú lateral izquierdo, busca tu servicio "rastreoapp"
2. Haz clic en el botón **"+"** o **"New"** (debería estar al lado de tu servicio)
3. Selecciona **"Database"**
4. Selecciona **"PostgreSQL"**

Railway creará automáticamente las variables de entorno de PostgreSQL.

---

### PASO 3: Configurar Variables de Entorno

1. En tu servicio "rastreoapp"
2. Ve a la pestaña **"Variables"**
3. Haz clic en **"+ New Variable"**
4. Agrega estas variables una por una:

```
NODE_ENV = production
JWT_SECRET = genera_un_secreto_con_openssl_rand_hex_32
JWT_EXPIRES_IN = 24h
```

**Para generar JWT_SECRET:**
```bash
openssl rand -hex 32
```

O simplemente usa cualquier texto largo y seguro.

---

### PASO 4: Trigger Manual Deploy

1. Ve a la pestaña **"Deployments"**
2. Haz clic en el botón **"Deploy"** o **"Manual Deploy"**
3. Railway re-deployará con la nueva configuración

---

## ✅ Verificar que Funciona

Una vez desplegado, deberías poder acceder a:

```
https://tu-proyecto.railway.app/health
```

Debería responder con JSON indicando que la base de datos está conectada.

---

## 🐛 Si Sigue Fallando

### Ver Logs

1. Ve a la pestaña **"Logs"** 
2. Revisa los mensajes de error

### Errores Comunes

**Error: "Cannot find module 'express'"**
→ Verificar que el Root Directory esté en `backend`

**Error: "Database connection failed"**
→ Verificar que PostgreSQL esté agregado y las variables existan

**Error: "No package.json found"**
→ Verificar que el Root Directory sea correcto

---

## 📝 Resumen de la Configuración

**En Source:**
- Root Directory: `backend`

**En Variables:**
- NODE_ENV = production
- JWT_SECRET = (generar uno seguro)

**PostgreSQL:**
- Agregado como servicio separado
- Variables se crean automáticamente

---

## 🚀 Comandos Útiles (Desde CLI)

Si prefieres usar la terminal:

```bash
# Login
railway login

# Link al proyecto (en directorio raíz)
railway link

# Especificar carpeta backend
railway up --service backend

# Ver logs
railway logs

# Ver variables
railway variables

# Ver URL
railway domain
```

---

**Después de configurar el Root Directory, haz Manual Deploy** 🔄

