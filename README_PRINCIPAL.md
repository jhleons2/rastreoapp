# 📍 Sistema de Rastreo de Ubicación - Taller 2 Redes MCIC

> ⭐ **NUEVO:** Lee primero [INICIO_AQUI.md](./INICIO_AQUI.md) para una guía rápida de inicio

## 🎯 Resumen del Proyecto

Sistema integral para rastrear ubicaciones geográficas de dispositivos móviles mediante:
- **Aplicación móvil** (iOS/Android) con GPS
- **Dashboard web** para visualización en tiempo real
- **Bot de Telegram** para envío manual de ubicaciones
- **API REST** robusta con autenticación segura

---

## ⚠️ NOTA IMPORTANTE: USO ÉTICO Y ACADÉMICO

Este sistema está desarrollado **exclusivamente con fines académicos** para el Taller No. 2 de Redes MCIC.

### ✅ Uso Permitido (con consentimiento explícito)
- Rastreo de dispositivos propios
- Rastreo familiar con consentimiento
- Rastreo de empleados con autorización
- Aplicaciones de seguridad personal

### ❌ Uso Prohibido
- Espionaje
- Acoso o stalking
- Rastreo sin consentimiento
- Violación de privacidad
- Cualquier actividad ilegal

**El usuario debe instalar la aplicación voluntariamente y tener conocimiento completo del rastreo.**

---

## 📋 Requisitos Funcionales

| Requisito | Estado | Descripción |
|-----------|--------|-------------|
| ✅ Registro por número telefónico | Implementado | Autenticación mediante número de teléfono |
| ✅ Captura de ubicación | Implementado | GPS en tiempo real y por intervalos |
| ✅ Actualización periódica | Implementado | Configurable (mínimo 10 minutos) |
| ✅ Visualización en mapa | Implementado | Integración con Mapbox/Google Maps |
| ✅ Alertas geofencing | Opcional | Notificaciones por zonas |
| ✅ Historial de ubicaciones | Implementado | Consulta por fecha/hora |
| ✅ Acceso seguro | Implementado | Autenticación JWT |

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                            │
├──────────────────┬───────────────┬──────────────────────────┤
│  Mobile App      │   Web Dashboard│   Telegram Bot          │
│  (React Native)  │   (React)     │   (Node.js)              │
└────────┬─────────┴───────┬───────┴────────────┬─────────────┘
         │                 │                     │
         └─────────────────┼─────────────────────┘
                           │
                           ▼
         ┌─────────────────────────────────┐
         │      BACKEND API LAYER          │
         │  (Node.js + Express)            │
         │  - Autenticación JWT            │
         │  - Gestión de dispositivos      │
         │  - Procesamiento de ubicaciones │
         │  - WebSockets (tiempo real)     │
         └──────────────┬──────────────────┘
                        │
         ┌──────────────┼──────────────┐
         │              │              │
         ▼              ▼              ▼
    ┌─────────┐   ┌─────────┐   ┌─────────┐
    │  Redis  │   │  PostgreSQL │ │ External│
    │(Cache/  │   │  (Database) │ │  APIs   │
    │ Sessions)│   └─────────────┘ └─────────┘
    └──────────┘           │              │
                           │              │
                           ▼              ▼
                    Historial DB     Mapbox API
                                   Google Maps
```

---

## 🔧 Stack Tecnológico

### Backend
- **Node.js** + **Express.js**
- **PostgreSQL** (base de datos relacional)
- **Redis** (caché y sesiones)
- **Socket.io** (comunicación en tiempo real)
- **JWT** (autenticación)

### Frontend Mobile
- **React Native**
- **React Native Geolocation Service**
- **React Native Maps**
- **Axios** (HTTP client)

### Frontend Web
- **React** + **TypeScript**
- **Mapbox GL JS**
- **Tailwind CSS**
- **Recharts** (gráficos)

### DevOps
- **Docker** + **Docker Compose**
- **Git** + **GitHub**
- **Postman** (testing APIs)

---

## 📁 Estructura del Proyecto

```
tracking-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Device.js
│   │   │   ├── Location.js
│   │   │   └── Geofence.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── deviceController.js
│   │   │   └── locationController.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── devices.js
│   │   │   └── locations.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── utils/
│   │   │   └── geofencing.js
│   │   └── server.js
│   ├── .env
│   └── package.json
├── mobile-app/
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── services/
│   │   └── utils/
│   ├── android/
│   └── ios/
├── dashboard/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── public/
├── telegram-bot/
│   └── index.js
└── docker-compose.yml
```

---

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js v16+
- PostgreSQL 12+
- Git
- Cuenta en Mapbox (opcional)
- Android Studio / Xcode (para desarrollo móvil)

### Instalación

1. **Clonar repositorio** (o usar estructura propuesta)

2. **Configurar Backend**
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales
npm run dev
```

3. **Configurar App Móvil**
```bash
cd mobile-app
npm install
# Para Android
npx react-native run-android
```

4. **Configurar Dashboard**
```bash
cd dashboard
npm install
npm start
```

Ver guía completa en: [GUIA_INSTALACION_IMPLEMENTACION.md](./GUIA_INSTALACION_IMPLEMENTACION.md)

---

## 📖 Documentación

### 🎯 Guías Principales (Empezar Aquí)

1. **[🚀 Guía Paso a Paso](./GUIA_DESPLIEGUE_PASO_A_PASO.md)** ⭐⭐⭐ - **EMPIEZA AQUÍ** - Guía práctica para desplegar TODO en Railway
2. **[🚂 Despliegue Completo en Railway](./RAILWAY_DEPLOYMENT_COMPLETO.md)** ⭐ - Guía técnica completa
3. **[Checklist de Requisitos](./CHECKLIST_REQUISITOS.md)** - Verifica qué cumple y qué falta

### 📚 Documentación Técnica

- **[Arquitectura Detallada](./ARQUITECTURA_SISTEMA_RASTREO.md)** - Diseño técnico completo del sistema
- **[Guía de Instalación Local](./GUIA_INSTALACION_IMPLEMENTACION.md)** - Instalar y probar localmente
- **[Ejemplos de Código](./Ejemplo_Configuracion_Railway.md)** - Ejemplos listos para copiar
- **[Guía Railway Básica](./GUIA_DESPLIEGUE_RAILWAY.md)** - Alternativa de despliegue básico

### 📄 Referencias

- **[Consideraciones Éticas](./CONSIDERACIONES_ETICAS.md)** - Uso responsable del sistema

---

## 🔐 Seguridad

### Características de Seguridad Implementadas

1. **Autenticación JWT** - Tokens seguros con expiración
2. **HTTPS** - Comunicación encriptada
3. **Autorización por usuario** - Solo acceso a propios dispositivos
4. **Validación de inputs** - Prevención de SQL injection
5. **Rate limiting** - Protección contra abuso
6. **Cifrado de datos sensibles** - Passwords hasheados con bcrypt

### Buenas Prácticas

- ✅ Consentimiento explícito del usuario
- ✅ Transparencia total del rastreo
- ✅ Control del usuario (puede detener rastreo)
- ✅ Datos cifrados en tránsito
- ✅ No se comparten datos con terceros

---

## 🧪 Testing

### Endpoints API Principales

```
POST   /api/auth/register     - Registrar usuario
POST   /api/auth/login        - Iniciar sesión
GET    /api/devices           - Listar dispositivos
POST   /api/devices           - Crear dispositivo
POST   /api/locations         - Enviar ubicación
GET    /api/locations/device/:id - Ver ubicaciones
GET    /api/locations/device/:id/current - Ubicación actual
```

### Cómo Probar

Ver sección de pruebas en [GUIA_INSTALACION_IMPLEMENTACION.md](./GUIA_INSTALACION_IMPLEMENTACION.md)

---

## 📊 Características Avanzadas

### Geofencing
- Define zonas geográficas virtuales
- Notificaciones al entrar/salir de zona
- Útil para seguridad familiar o empresarial

### Tiempo Real
- Actualizaciones instantáneas vía WebSockets
- Múltiples usuarios pueden ver la misma ubicación

### Historial y Analytics
- Visualización de rutas recorridas
- Gráficos de velocidad y tiempo
- Exportar datos históricos

---

## 🐛 Solución de Problemas

### Problema: Backend no conecta a base de datos
**Solución**: Verificar que PostgreSQL esté corriendo y credenciales en `.env`

### Problema: Permisos de ubicación denegados
**Solución**: Verificar `AndroidManifest.xml` y permisos en configuración iOS

### Problema: API no responde
**Solución**: Verificar que el servidor esté corriendo en el puerto correcto

Ver más soluciones en: [GUIA_INSTALACION_IMPLEMENTACION.md](./GUIA_INSTALACION_IMPLEMENTACION.md)

---

## 🤝 Contribuir

### Workflow de Desarrollo

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### Estándares de Código

- Usar ES6+ JavaScript
- Comentar código complejo
- Seguir convenciones de nombres consistentes
- Implementar tests para nuevas funcionalidades

---

## 📞 Soporte

- **Documentación**: Revisar archivos `.md` en el repositorio
- **Issues**: Reportar problemas en el repositorio
- **Email**: Para consultas académicas directas

---

## 📄 Licencia

Este proyecto es de **carácter académico** para el Taller No. 2 de Redes MCIC.

**No está diseñado ni debe ser usado para:**
- Espionaje
- Actividades ilegales
- Violación de privacidad
- Cualquier uso malicioso

**El uso de este sistema es responsabilidad del usuario.**

---

## 📚 Referencias

- [React Native Documentation](https://reactnative.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [WebSocket Protocol](https://tools.ietf.org/html/rfc6455)

---

## ✅ Checklist de Implementación

### Fase 1: Setup (Semana 1)
- [ ] Configurar backend con Express
- [ ] Crear base de datos PostgreSQL
- [ ] Implementar modelos de datos
- [ ] Configurar autenticación JWT
- [ ] Crear endpoints básicos

### Fase 2: App Móvil (Semana 2-3)
- [ ] Configurar React Native
- [ ] Implementar captura de ubicación
- [ ] Integrar con API backend
- [ ] Implementar UI básica
- [ ] Probar en dispositivo real

### Fase 3: Dashboard Web (Semana 3-4)
- [ ] Crear proyecto React
- [ ] Integrar Mapbox
- [ ] Implementar visualización
- [ ] Agregar gráficos de historial
- [ ] Implementar tiempo real con WebSockets

### Fase 4: Características Avanzadas (Semana 4-5)
- [ ] Implementar geofencing
- [ ] Bot de Telegram (opcional)
- [ ] Optimización de batería
- [ ] Mejoras de UI/UX
- [ ] Testing y depuración

### Fase 5: Documentación y Despliegue (Semana 5)
- [ ] Completar documentación
- [ ] Dockerizar aplicación
- [ ] Desplegar en cloud
- [ ] Preparar demostración
- [ ] Presentar proyecto

---

## 🎓 Información Académica

**Taller**: Taller No. 2  
**Materia**: Redes MCIC  
**Componente**: Parte IV - Programación  
**Técnicas**: Inteligencia Artificial, Aplicaciones Web, APIs REST  

**Objetivo**: Desarrollar un sistema de rastreo geográfico ético y funcional que demuestre conocimiento en:
- Arquitectura de sistemas
- APIs REST
- Geolocalización
- WebSockets
- Desarrollo móvil
- Bases de datos

---

**Desarrollado con fines académicos y éticos** 🎓

