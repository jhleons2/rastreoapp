# 🔧 Verificar Variables de PostgreSQL en Railway

## ❌ Problema
La base de datos está "disconnected" según el health check.

## ✅ Solución

### PASO 1: Ver Logs en Railway

1. Ve a Railway Dashboard
2. Click en **rastreoapp**
3. Click en **Logs**
4. Busca mensajes de error relacionados con la base de datos

Deberías ver algo como:
```
⚠️ Base de datos no conectada: [mensaje de error]
```

### PASO 2: Verificar Variables de Entorno

1. En Railway Dashboard
2. Click en **rastreoapp**
3. Click en **Variables**
4. Busca estas variables:

```
DATABASE_URL
```

O individuales:
```
PGHOST
PGPORT
PGUSER
PGPASSWORD
PGDATABASE
```

### PASO 3: Si NO existen las variables

Necesitas copiar las variables de PostgreSQL:

1. Ve a tu servicio **PostgreSQL** (panel izquierdo)
2. Click en **Variables**
3. Busca `DATABASE_URL`
4. Click en "..." → "Reveal"
5. Copia el valor

6. Ve de vuelta a **rastreoapp** → **Variables**
7. Click en **"+ New Variable"**
8. Nombre: `DATABASE_URL`
9. Valor: (pega el valor que copiaste)
10. Save

### PASO 4: Redeploy

1. Ve a **Deployments**
2. Click en **"...**
3. **Redeploy**
4. Espera 1-2 minutos

### PASO 5: Verificar

Después del redeploy, prueba:
```
https://rastreoapp-production.up.railway.app/health
```

Deberías ver:
```json
{
  "status": "ok",
  "database": "connected",  ← Esto debería cambiar a "connected"
  "timestamp": "...",
  "environment": "production",
  "version": "1.0.0"
}
```

---

## 🔍 Mensajes de Error Comunes

### "DATABASE_URL is not defined"
→ Agrega la variable DATABASE_URL desde PostgreSQL

### "Connection refused"
→ PostgreSQL no está corriendo o no está accesible

### "Password authentication failed"
→ PASSWORD incorrecta en las variables

### "Database does not exist"
→ PGDATABASE tiene un nombre incorrecto

---

## ⚡ Acción Rápida

1. Ve a Railway Dashboard
2. Postgres → Variables → copiar DATABASE_URL
3. rastreoapp → Variables → agregar DATABASE_URL
4. rastreoapp → Deployments → Redeploy
5. Esperar 1-2 minutos
6. Probar /health

