# 📍 Sistema de Rastreo - Taller 2 Redes MCIC

> ⭐ **NUEVO:** Lee [INICIO_AQUI.md](./INICIO_AQUI.md) para empezar

Sistema de rastreo geográfico desplegado en Railway.

## 🚀 Deployment en Railway

### Configuración Actual

- **Backend:** Node.js + Express
- **Base de datos:** PostgreSQL (Railway)
- **Deploy:** Automático desde GitHub

### 📂 Estructura del Proyecto

```
rastreoapp/
├── backend/              # Backend Node.js (esta carpeta)
│   ├── src/
│   ├── package.json
│   └── railway.json
├── INICIO_AQUI.md        # Empieza aquí
└── Documentación completa...
```

## 🚂 Comandos para Railway

### Si no has desplegado:

```bash
cd backend
railway init
railway link
railway add postgresql
railway variables set JWT_SECRET=$(openssl rand -hex 32)
railway up
```

### Si ya está desplegado:

```bash
# Verificar configuración en Railway Dashboard
# Settings → Root Directory debe ser: "backend"

# O desde CLI:
railway status
railway logs
railway domain
```

## 🔧 Solución: Railway Detecta Golang

Si Railway está detectando Golang en lugar de Node.js:

1. **En Railway Dashboard:**
   - Ve a Settings
   - Root Directory: `backend`
   - Save

2. **O usar CLI:**
```bash
railway variables set RAILWAY_DOCKERFILE_PATH=backend
```

3. **Re-deploy:**
```bash
railway up
```

## ✅ Health Check

Una vez desplegado, deberías poder acceder a:

```
https://tu-proyecto.railway.app/health
```

Debería responder:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

## 📚 Documentación Completa

- [INICIO_AQUI.md](./INICIO_AQUI.md) - Guía rápida
- [GUIA_DESPLIEGUE_PASO_A_PASO.md](./GUIA_DESPLIEGUE_PASO_A_PASO.md) - Deploy completo
- [COMO_COMPLETAR_CODIGO.md](./COMO_COMPLETAR_CODIGO.md) - Completar funcionalidades
- [CHECKLIST_REQUISITOS.md](./CHECKLIST_REQUISITOS.md) - Verificar requisitos

## 🐛 Troubleshooting

### Railway detecta Golang
→ Ver sección "Solución" arriba

### Build Failed
```bash
railway logs
# Verificar errores
```

### Base de datos no conecta
```bash
# Verificar variables de PostgreSQL
railway variables
# Deben existir: PGHOST, PGPORT, PGUSER, etc.
```

## 📞 Comandos Útiles

```bash
# Ver logs
railway logs

# Ver status
railway status

# Ver variables
railway variables

# Reiniciar
railway restart

# Ver URL
railway domain
```

---

**Desarrollado para Taller 2 Redes MCIC**

