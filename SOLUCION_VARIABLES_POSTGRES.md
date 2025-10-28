# 🔧 Solución: Variables de PostgreSQL No Disponibles

## ❌ Problema Actual

El error persiste porque tu servicio `rastreoapp` no puede ver las variables de PostgreSQL.

## ✅ Solución: Compartir Variables entre Servicios

### PASO 1: Ir a PostgreSQL Service

1. En el panel izquierdo, click en **"Postgres"** (el servicio que creaste)
2. Ve a la pestaña **"Variables"**

### PASO 2: Copiar DATABASE_URL

1. En Variables de PostgreSQL, busca:
   - `PGHOST`
   - `PGPORT`
   - `PGUSER`
   - `PGPASSWORD`
   - `PGDATABASE`

2. O busca `DATABASE_URL` (si existe)

### PASO 3: Ir a rastreoapp y Agregar Variables

1. Click en **"rastreoapp"** (en el panel izquierdo)
2. Ve a **"Variables"**
3. Click en **"+ New Variable"**

4. Agrega estas variables (las copiaste de PostgreSQL):

```
Variable: PGHOST
Value: (copia el valor de PostgreSQL)

Variable: PGPORT
Value: (copia el valor de PostgreSQL)

Variable: PGUSER
Value: (copia el valor de PostgreSQL)

Variable: PGPASSWORD
Value: (copia el valor de PostgreSQL)

Variable: PGDATABASE
Value: (copia el valor de PostgreSQL)
```

**O más fácil:**

```
Variable: DATABASE_URL
Value: postgresql://postgres:password@host:5432/railway
```

Donde reemplazas con tus valores reales.

---

## 🎯 OPCIÓN ALTERNATIVA MÁS FÁCIL

### Configurar DATABASE_URL Manualmente

1. Ve a **rastreoapp → Variables**
2. Click **"+ New Variable"**
3. Nombre: `DATABASE_URL`
4. Valor: (formato)
   ```
   postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
   ```
5. Replace con valores de **PostgreSQL → Variables**

**Ejemplo:**
```
postgresql://postgres:abc123@containers-us-west-1.railway.app:5432/railway
```

---

## 🔍 Cómo Obtener los Valores

### Desde Railway Dashboard:

1. Click en **"Postgres"** (servicio)
2. **"Variables"**
3. Verás todos los valores
4. Cópialos uno por uno

### O desde Terminal:

```bash
# Si usas railway CLI
railway variables --service=postgres
```

---

## ✅ Después de Configurar

1. **Redeploy rastreoapp** desde Deployments
2. Espera 2-3 minutos
3. Verifica en Logs
4. Deberías ver: `✅ Base de datos conectada correctamente`

---

## 📝 Formato de DATABASE_URL

Si tienes estos valores:
- PGHOST: containers-us-west-1.railway.app
- PGPORT: 5432
- PGUSER: postgres
- PGPASSWORD: abc123xyz
- PGDATABASE: railway

Tu DATABASE_URL sería:
```
postgresql://postgres:abc123xyz@containers-us-west-1.railway.app:5432/railway
```

---

## 🚨 IMPORTANTE

No es necesario tener tablas todavía. Las tablas se crearán automáticamente cuando agregues los modelos.

Por ahora solo necesitas la CONEXIÓN funcionando.

