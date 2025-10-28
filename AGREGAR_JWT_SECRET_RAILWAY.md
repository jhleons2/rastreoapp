# ⚠️ CRÍTICO: Agregar JWT_SECRET en Railway

## 🔍 Problema

El error 500 ocurre porque falta la variable `JWT_SECRET` en Railway.

---

## ✅ SOLUCIÓN INMEDIATA

En Railway Dashboard:

### PASO 1: Agregar JWT_SECRET al Backend

1. Ve a **rastreoapp** (backend)
2. Click en **Settings** → **Variables**
3. Click en **"New Variable"**
4. **Name:** `JWT_SECRET`
5. **Value:** `tu-secreto-super-seguro-123456`
6. Click en **Save**

### PASO 2: Redeploy Backend

1. Ve a **Deployments**
2. Click en **"..."** → **"Redeploy"**
3. Espera 2-3 minutos

### PASO 3: Probar de Nuevo

Después del redeploy, intenta registrar o iniciar sesión de nuevo.

---

## 🔐 Generar JWT_SECRET Seguro

Puedes usar este valor (cambia los números):

```
tu-secreto-jwt-para-rastreoapp-2024-123456789
```

O genera uno seguro en: https://randomkeygen.com/

Copia un valor de "CodeIgniter Encryption Keys"

---

**¿Ya agregaste JWT_SECRET en Railway?**

