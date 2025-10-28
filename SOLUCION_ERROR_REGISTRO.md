# ⚠️ Problema: No Deja Registrar

## 🔍 Verificaciones Necesarias

### PASO 1: Verificar Consola del Navegador

1. Abre la página de registro
2. Presiona `F12` para abrir DevTools
3. Ve a la pestaña **"Console"**
4. Intenta registrar
5. **¿Qué errores ves?**

Busca errores como:
- `Failed to fetch`
- `Network error`
- `CORS error`
- `404 Not Found`

### PASO 2: Verificar Variables de Entorno en Railway

En Railway Dashboard:

1. Ve a **rastreoapp-frontend-production**
2. Click en **Settings** → **Variables**
3. **¿Existe la variable `VITE_API_URL`?**

**Debería tener el valor:**
```
https://rastreoapp-production.up.railway.app
```

**Si NO existe:**
- Click en **"New Variable"**
- Name: `VITE_API_URL`
- Value: `https://rastreoapp-production.up.railway.app`
- Save
- Redeploy

### PASO 3: Verificar Logs

En Railway Dashboard:

1. Ve a **rastreoapp** (backend)
2. Click en **Logs**
3. Intenta registrar desde el frontend
4. **¿Ves algún error en los logs del backend?**

---

## 🔧 Posibles Soluciones

### SOLUCIÓN 1: Variable de Entorno Faltante

Si `VITE_API_URL` no existe:

1. Railway → rastreoapp-frontend → Variables
2. New Variable: `VITE_API_URL`
3. Value: `https://rastreoapp-production.up.railway.app`
4. Save
5. Deployments → Redeploy

### SOLUCIÓN 2: Error CORS

Si ves error de CORS en la consola:

Verifica que el backend tenga CORS habilitado (ya lo tiene configurado).

### SOLUCIÓN 3: Backend No Responde

Verifica que el backend esté funcionando:

Abre: https://rastreoapp-production.up.railway.app/health

Debería responder: `{"status":"ok","database":"connected"}`

---

## 🎯 Acción Inmediata

**Abre la Consola del Navegador (F12) y comparte el error que ves cuando intentas registrar.**

Esto me permitirá diagnosticar exactamente qué está fallando.

