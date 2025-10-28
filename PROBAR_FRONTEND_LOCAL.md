# 🧪 Cómo Probar el Frontend Localmente

## ⚡ Inicio Rápido

### PASO 1: Instalar Dependencias

```bash
cd frontend
npm install
```

### PASO 2: Configurar API

Crea un archivo `.env` en `frontend/`:

```env
VITE_API_URL=https://rastreoapp-production.up.railway.app
```

### PASO 3: Ejecutar

```bash
npm run dev
```

Abre: http://localhost:3000

---

## 🎯 Funcionalidades Disponibles

### ✅ Login/Registro
- Registrarte con número de teléfono
- Iniciar sesión
- Autenticación JWT automática

### ✅ Dashboard
- Ver estadísticas
- Accesos rápidos
- Vista general del sistema

### ✅ Dispositivos
- Listar tus dispositivos
- Registrar nuevo dispositivo
- Editar información
- Eliminar dispositivos

### ⏳ Ubicaciones
- Interfaz preparada
- Mapa por implementar

---

## 🖥️ Probar Funcionalidades

### 1. Registrar Usuario

1. Ve a http://localhost:3000/register
2. Completa el formulario:
   - Número: `+573001234567`
   - Contraseña: `test123`
3. Click en "Crear Cuenta"
4. Serás redirigido al Dashboard

### 2. Registrar Dispositivo

1. En el Dashboard, click en "Dispositivos" en el menú
2. Click en "Registrar Dispositivo"
3. Completa el formulario:
   - Nombre: `Mi Celular`
   - Tipo: `Móvil`
4. Click en "Registrar"

### 3. Ver Dashboard

1. Regresa al Dashboard
2. Verás las estadísticas actualizadas

---

## 🎨 Diseño

- ✅ Responsive (móvil, tablet, desktop)
- ✅ Tailwind CSS para estilos
- ✅ Iconos con Lucide React
- ✅ Notificaciones con Toast
- ✅ Gradientes y colores modernos

---

## 🚀 Siguiente Paso: Desplegar en Railway

Consulta: `DESPLEGAR_FRONTEND_RAILWAY.md`

