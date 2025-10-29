# 🚀 Ejecutar Migración - Paso a Paso Inmediato

## ⚡ MÉTODO RÁPIDO (Railway Dashboard) - 2 minutos

### Paso 1: Ir a Railway
1. Abre: https://railway.app
2. Inicia sesión

### Paso 2: Acceder a PostgreSQL
1. Selecciona tu proyecto
2. Haz clic en el servicio **"PostgreSQL"** (o "Postgres")
3. En el menú lateral, busca: **"Query"** o **"Data" → "Query"**

### Paso 3: Ejecutar SQL
Copia y pega EXACTAMENTE esto:

```sql
ALTER TABLE locations ADD COLUMN IF NOT EXISTS address TEXT;
```

4. Haz clic en **"Run"** o **"Execute"**

### Paso 4: Verificar
Deberías ver: `ALTER TABLE` ✅

---

## 🎯 ¿Dónde está el Query en Railway?

Si no encuentras "Query":

1. Ve a tu proyecto
2. Haz clic en **PostgreSQL**
3. Busca alguna de estas opciones:
   - **"Data"** → **"Query"**
   - **"Connect"** → Abre terminal/consola
   - **"Variables"** (no es este, pero está cerca)

Si aún no lo encuentras:
- Ve a **Settings** → Busca **"Database URL"**
- Copia el valor de `DATABASE_PUBLIC_URL` o `DATABASE_URL`
- Úsalo con psql (ver método 2 abajo)

---

## 🔧 MÉTODO ALTERNATIVO: Terminal (Si tienes psql)

Si tienes acceso a terminal con PostgreSQL:

**Windows PowerShell:**
```powershell
# Opción 1: Si tienes DATABASE_URL configurada
$env:DATABASE_URL
# Si existe, usa:
psql $env:DATABASE_URL -c "ALTER TABLE locations ADD COLUMN IF NOT EXISTS address TEXT;"

# Opción 2: Con variables individuales (copiar desde Railway)
$env:PGHOST = "tu-host"
$env:PGPORT = "5432"
$env:PGUSER = "postgres"
$env:PGPASSWORD = "tu-password"
$env:PGDATABASE = "railway"
psql "postgres://$env:PGUSER:$env:PGPASSWORD@$env:PGHOST:$env:PGPORT/$env:PGDATABASE" -c "ALTER TABLE locations ADD COLUMN IF NOT EXISTS address TEXT;"
```

**Linux/Mac:**
```bash
psql $DATABASE_URL -c "ALTER TABLE locations ADD COLUMN IF NOT EXISTS address TEXT;"
```

---

## ✅ Verificación Rápida

Después de ejecutar, verifica que funcionó:

**En Railway Query, ejecuta:**
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'locations' AND column_name = 'address';
```

**Deberías ver:** Una fila con `address`

---

## 🆘 ¿Problemas?

### "column already exists" ✅
**Esto está bien** - La columna ya existe, puedes continuar.

### "relation 'locations' does not exist"
→ Las tablas aún no se han creado
→ El backend las creará automáticamente en el primer deploy
→ O ejecuta en el backend: `sequelize.sync()`

### No encuentro "Query" en Railway
→ Busca "Connect" o "Terminal"
→ O usa Railway CLI (ver abajo)

---

## 🚂 Railway CLI (Opcional)

Si tienes Railway CLI instalado:

```bash
railway connect postgres
# Luego en la consola que se abre:
ALTER TABLE locations ADD COLUMN IF NOT EXISTS address TEXT;
\q
```

---

## 🎯 Después de la Migración

Una vez ejecutada la migración:

1. **✅ Listo** - La geocodificación funcionará automáticamente
2. **✅ Listo** - Las estadísticas estarán disponibles
3. **Prueba:**
   - Crea una ubicación con `POST /api/locations`
   - Verifica que incluye `"address"` en la respuesta
   - Prueba `GET /api/stats/device/1`

---

## 📞 ¿Aún con Dudas?

**Resumen ultra corto:**
1. Railway → PostgreSQL → Query
2. Pega: `ALTER TABLE locations ADD COLUMN IF NOT EXISTS address TEXT;`
3. Ejecuta
4. ✅ Listo

**Tiempo total:** ~2 minutos ⚡
