# 📦 Guía de Instalación - Sistema de Rastreo Geográfico

Esta guía te ayudará a instalar y configurar el sistema completo en tu entorno local o en producción.

## 📋 Requisitos Previos

### Software Necesario

- **Node.js** >= 18.0.0 ([Descargar](https://nodejs.org/))
- **npm** o **yarn** (incluido con Node.js)
- **PostgreSQL** >= 14 ([Descargar](https://www.postgresql.org/download/))
- **Git** ([Descargar](https://git-scm.com/))
- **Android Studio** (solo para compilar APK) ([Descargar](https://developer.android.com/studio))

### Verificar Instalaciones

```bash
node --version   # Debe mostrar v18.0.0 o superior
npm --version    # Debe mostrar 8.0.0 o superior
psql --version   # Debe mostrar 14.0 o superior
git --version    # Cualquier versión reciente
```

## 🚀 Instalación Rápida (Desarrollo Local)

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/taller2-redes.git
cd taller2-redes
```

### Paso 2: Configurar Base de Datos

#### Opción A: PostgreSQL Local

```bash
# Iniciar PostgreSQL
# Windows: Abrir pgAdmin o usar servicios
# macOS: brew services start postgresql
# Linux: sudo service postgresql start

# Crear base de datos
psql -U postgres
CREATE DATABASE rastreo_db;
CREATE USER rastreo_user WITH PASSWORD 'tu_password_segura';
GRANT ALL PRIVILEGES ON DATABASE rastreo_db TO rastreo_user;
\q
```

#### Opción B: PostgreSQL con Docker

```bash
docker run --name postgres-rastreo \
  -e POSTGRES_DB=rastreo_db \
  -e POSTGRES_USER=rastreo_user \
  -e POSTGRES_PASSWORD=tu_password_segura \
  -p 5432:5432 \
  -d postgres:14
```

### Paso 3: Configurar Backend

```bash
cd backend
npm install

# Crear archivo .env
cat > .env << 'EOF'
# Base de datos
DATABASE_URL=postgresql://rastreo_user:tu_password_segura@localhost:5432/rastreo_db

# Seguridad
JWT_SECRET=tu_clave_secreta_muy_segura_cambiame_123456789
NODE_ENV=development

# Puerto (opcional)
PORT=3000

# Telegram Bot (opcional)
TELEGRAM_BOT_TOKEN=
EOF

# Iniciar servidor
npm start
```

El backend debería estar corriendo en `http://localhost:3000`

**Verificar**:
```bash
curl http://localhost:3000/health
# Debe responder: {"status":"ok","database":"connected",...}
```

### Paso 4: Configurar Frontend

```bash
cd ../frontend
npm install

# Crear archivo .env
cat > .env << 'EOF'
VITE_API_URL=http://localhost:3000
EOF

# Iniciar servidor de desarrollo
npm run dev
```

El frontend debería estar corriendo en `http://localhost:5173`

**Verificar**: Abre el navegador en `http://localhost:5173`

### Paso 5: Configurar Aplicación Móvil

```bash
cd ../mobile
npm install

# Editar configuración de API
# Abre mobile/src/config/api.js y cambia la URL:
```

```javascript
// mobile/src/config/api.js
const API_URL = 'http://TU_IP_LOCAL:3000/api';
// Ejemplo: const API_URL = 'http://192.168.1.100:3000/api';
```

⚠️ **Importante**: No uses `localhost` o `127.0.0.1` en la app móvil. Usa la IP local de tu computadora.

**Encontrar tu IP**:
- Windows: `ipconfig` (busca IPv4)
- macOS/Linux: `ifconfig` o `ip addr`

```bash
# Iniciar Expo
npm start

# Escanear código QR con Expo Go app
# O presionar 'a' para abrir en emulador Android
```

## 📱 Generar APK para Android

### Método 1: Con Android Studio (Recomendado)

1. **Abrir proyecto Android**:
   ```bash
   cd mobile/android
   ```

2. **Abrir Android Studio** → Open → Seleccionar carpeta `mobile/android`

3. **Esperar sincronización de Gradle**

4. **Build APK**:
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - O ejecutar: `./gradlew assembleDebug`

5. **Ubicación del APK**:
   ```
   mobile/android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Método 2: Desde Línea de Comandos

```bash
cd mobile/android

# En Windows
gradlew.bat assembleDebug

# En macOS/Linux
./gradlew assembleDebug
```

### Método 3: Con EAS Build (Expo)

```bash
cd mobile

# Instalar EAS CLI
npm install -g eas-cli

# Login en Expo
eas login

# Configurar proyecto
eas build:configure

# Construir APK
eas build --platform android --profile preview
```

## 🌐 Instalación en Producción (Railway)

### Requisitos

- Cuenta en [Railway](https://railway.app/) (gratis)
- Cuenta de GitHub
- Repositorio del proyecto en GitHub

### Paso 1: Conectar GitHub a Railway

1. Ir a [railway.app](https://railway.app/)
2. Click en "Start a New Project"
3. Seleccionar "Deploy from GitHub repo"
4. Autorizar acceso a tu repositorio
5. Seleccionar el repositorio del proyecto

### Paso 2: Crear Servicio de Base de Datos

1. En tu proyecto Railway, click en "+ New"
2. Seleccionar "Database" → "PostgreSQL"
3. Railway creará automáticamente la base de datos
4. **Copiar la variable `DATABASE_URL`** (la necesitarás después)

### Paso 3: Desplegar Backend

1. En Railway, click en "+ New"
2. Seleccionar "GitHub Repo"
3. Seleccionar tu repositorio
4. **Configurar Root Directory**: `/backend`
5. Click en el servicio → Settings
6. **Agregar Variables de Entorno**:
   ```
   DATABASE_URL=postgresql://... (copiar de la base de datos)
   JWT_SECRET=genera_una_clave_segura_aqui
   NODE_ENV=production
   TELEGRAM_BOT_TOKEN=opcional
   ```
7. **Settings → Networking → Generate Domain**
8. Copiar la URL generada (ej: `https://rastreoapp-production.up.railway.app`)

### Paso 4: Desplegar Frontend

1. En Railway, click en "+ New"
2. Seleccionar "GitHub Repo"  
3. Seleccionar tu repositorio
4. **Configurar Root Directory**: `/frontend`
5. Click en el servicio → Settings
6. **Agregar Variable de Entorno**:
   ```
   VITE_API_URL=https://tu-backend.up.railway.app
   ```
   (Usar la URL del backend del paso anterior)
7. **Settings → Networking → Generate Domain**
8. Copiar la URL del frontend

### Paso 5: Configurar Aplicación Móvil para Producción

```javascript
// mobile/src/config/api.js
const API_URL = 'https://tu-backend.up.railway.app/api';
```

Recompilar el APK con esta configuración.

## 🔧 Configuración Avanzada

### Variables de Entorno

#### Backend (.env)

```bash
# Base de datos
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Seguridad
JWT_SECRET=clave_secreta_minimo_32_caracteres
NODE_ENV=development|production

# Servidor
PORT=3000

# Bots (opcional)
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
ENABLE_WHATSAPP_BOT=false

# Geocodificación (opcional)
NOMINATIM_EMAIL=tu@email.com
```

#### Frontend (.env)

```bash
# URL del backend
VITE_API_URL=http://localhost:3000

# En producción
VITE_API_URL=https://tu-backend.up.railway.app
```

### Configurar Bot de Telegram

1. **Crear Bot**:
   - Abrir Telegram y buscar `@BotFather`
   - Enviar `/newbot`
   - Seguir instrucciones
   - Copiar el token generado

2. **Agregar Token al Backend**:
   ```bash
   # En .env
   TELEGRAM_BOT_TOKEN=123456789:ABC-DEF...
   ```

3. **Reiniciar Backend**:
   ```bash
   npm start
   ```

## 🧪 Verificar Instalación

### 1. Verificar Backend

```bash
# Health check
curl http://localhost:3000/health

# Registro de usuario
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"12345678"}'

# Debe responder con user y token
```

### 2. Verificar Frontend

1. Abrir `http://localhost:5173`
2. Debe aparecer página de login
3. Registrar un usuario nuevo
4. Debe redirigir al dashboard

### 3. Verificar App Móvil

1. Abrir app en dispositivo/emulador
2. Registrar usuario (mismo email que usaste en web)
3. Iniciar rastreo
4. Verificar que aparezca "RASTREO ACTIVO"
5. Esperar 1 minuto
6. En el frontend web, ir a "Ubicaciones"
7. Debe aparecer la ubicación en el mapa

## 🐛 Solución de Problemas

### Backend no inicia

**Error: "Cannot connect to database"**

```bash
# Verificar que PostgreSQL esté corriendo
pg_isready

# Verificar credenciales en .env
# Verificar que la base de datos exista
psql -U postgres -l
```

**Error: "JWT_SECRET is required"**

```bash
# Agregar JWT_SECRET al .env
echo 'JWT_SECRET=mi_clave_super_secreta_123456' >> .env
```

### Frontend no conecta con Backend

**Error: "Network Error"**

1. Verificar que el backend esté corriendo
2. Verificar CORS en backend (debe permitir origen del frontend)
3. Verificar VITE_API_URL en frontend/.env

**Error: "Cannot read .env"**

```bash
# Reinstalar dependencias
npm install
```

### App Móvil no envía ubicaciones

**Error: "Permission denied"**

1. Ir a Configuración del teléfono
2. Aplicaciones → RastreoApp → Permisos
3. Ubicación → Permitir siempre

**Error: "Network request failed"**

1. Verificar que uses la IP local correcta (no localhost)
2. Verificar que el backend esté accesible desde el teléfono
3. Verificar que estén en la misma red WiFi

### APK no compila

**Error: "SDK not found"**

1. Abrir Android Studio
2. SDK Manager → Instalar Android SDK 33
3. Reintentar compilación

**Error: "Gradle build failed"**

```bash
cd mobile/android
./gradlew clean
./gradlew assembleDebug
```

## 📚 Próximos Pasos

Después de la instalación exitosa:

1. Lee la [Guía de Uso](GUIA_USO.md)
2. Revisa la [Arquitectura del Sistema](ARQUITECTURA.md)
3. Consulta el [API Reference](API_REFERENCE.md)
4. Lee las [FAQ](FAQ.md)

## 💡 Tips

- **Desarrollo**: Usa `nodemon` para auto-restart del backend
- **Base de Datos**: Usa pgAdmin para visualizar datos
- **Depuración Móvil**: Usa React Native Debugger o Flipper
- **Logs**: Revisa los logs de Railway para debugging en producción
- **Performance**: Ajusta el intervalo de envío de ubicaciones según necesidad

## 🆘 Soporte

Si tienes problemas:

1. Revisa la sección [Solución de Problemas](#solución-de-problemas)
2. Consulta las [FAQ](FAQ.md)
3. Abre un issue en GitHub
4. Contacta al equipo de desarrollo

---

**¡Instalación completada! 🎉**

Ahora estás listo para usar el sistema de rastreo geográfico.

