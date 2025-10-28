# 📋 Cómo Obtener los Valores de PostgreSQL

## 🔍 Método 1: Reveal las Variables (MÁS FÁCIL)

Estás en la pantalla de Variables de PostgreSQL:

### PASO 1: Reveal los Valores

Para cada variable que necesitas:

1. **PGHOST**
   - Click en los **"..."** (3 puntos) al lado derecho de PGHOST
   - Click en **"Reveal"** o **"View value"**
   - Copia el valor (ejemplo: `containers-us-west-1.railway.app`)

2. **PGPORT**
   - Mismo proceso
   - Debería ser: `5432` (puerto estándar de PostgreSQL)

3. **PGUSER**
   - Revelar
   - Debería ser: `postgres`

4. **PGPASSWORD**
   - Revelar
   - Copia el valor (ejemplo: `abc123xyz456`)

5. **PGDATABASE**
   - Revelar
   - Debería ser: `railway` o similar

---

## 🎯 Construir DATABASE_URL

Una vez tengas los valores, constrúyelo así:

```
postgresql://[PGUSER]:[PGPASSWORD]@[PGHOST]:[PGPORT]/[PGDATABASE]
```

### Ejemplo con valores reales:

Si obtuviste:
- PGHOST: `containers-us-west-1.railway.app`
- PGPORT: `5432`
- PGUSER: `postgres`
- PGPASSWORD: `abc123xyz456`
- PGDATABASE: `railway`

Tu DATABASE_URL sería:

```
postgresql://postgres:abc123xyz456@containers-us-west-1.railway.app:5432/railway
```

---

## 📝 PASO 2: Agregar DATABASE_URL a rastreoapp

1. Ve a **"rastreoapp"** (panel izquierdo)
2. **"Variables"** (pestaña)
3. **"+ New Variable"**
4. Nombre: `DATABASE_URL`
5. Valor: (pega la URL que construiste)
6. Save

---

## ✅ PASO 3: Redeploy

1. Ve a **"Deployments"**
2. Click en **"..."**
3. **"Redeploy"**
4. Espera 2-3 minutos

---

## 🔍 Método 2: Usar DATABASE_URL Directamente

Si ves que existe **DATABASE_URL** en las variables de PostgreSQL:

1. Click en **"..."** de DATABASE_URL
2. **"Reveal"**
3. Copia todo el valor (ya está completo)
4. Agregar a rastreoapp → Variables

---

## ⚡ Método 3: Copiar desde Terminal (Opcional)

Si tienes Railway CLI instalado:

```bash
railway variables --service=postgres
```

Esto mostrará todas las variables con sus valores.

---

## 📊 Resumen

**Necesitas estos valores:**
1. PGHOST → (ej: containers-us-west-1.railway.app)
2. PGPORT → (ej: 5432)
3. PGUSER → (ej: postgres)
4. PGPASSWORD → (ej: abc123xyz456)
5. PGDATABASE → (ej: railway)

**Construir URL:**
```
postgresql://postgres:abc123xyz456@containers-us-west-1.railway.app:5432/railway
```

**Agregar a rastreoapp:**
- Variable: `DATABASE_URL`
- Valor: (la URL que construiste)

---

¡Empieza revelando PGHOST y construyendo la URL paso a paso!

