# 📚 Documentación - Sistema de Rastreo Geográfico

Bienvenido a la documentación completa del Sistema de Rastreo Geográfico.

## 📖 Índice de Documentación

### 🚀 Para Empezar

1. **[README Principal](../README.md)** - Visión general del proyecto
2. **[Guía de Instalación](GUIA_INSTALACION.md)** - Instalación paso a paso
3. **[Guía de Uso](GUIA_USO.md)** - Cómo usar todas las funcionalidades
4. **[FAQ](FAQ.md)** - Preguntas frecuentes

### 🏗️ Arquitectura y Diseño

5. **[Arquitectura del Sistema](ARQUITECTURA.md)** - Diseño y componentes técnicos
6. **[API Reference](API_REFERENCE.md)** - Documentación completa de la API REST

### 📱 Aplicación Móvil

7. **[Generar APK](GENERAR_APK.md)** - Guía para compilar la aplicación Android
8. **[Instrucciones Rápidas App Móvil](INSTRUCCIONES_RAPIDAS_APP_MOVIL.md)** - Inicio rápido para usuarios
9. **[Cómo Usar la App](COMO_USAR_APP_RASTREO.md)** - Guía detallada de uso de la app

### 🌐 Despliegue

10. **[Desplegar en Railway](GUIA_DESPLIEGUE_RAILWAY.md)** - Deployment en producción paso a paso
11. **[Guía Completa de Pruebas](GUIA_COMPLETA_PRUEBA_SISTEMA.md)** - Testing del sistema completo

### 🤖 Integraciones

12. **[Bot de Telegram](COMO_USAR_BOT_TELEGRAM.md)** - Configuración y uso del bot

## 🗂️ Estructura del Proyecto

```
taller2-redes/
├── backend/              # Servidor Node.js + Express + PostgreSQL
│   ├── src/
│   │   ├── server.js    # Punto de entrada
│   │   ├── models/      # Modelos Sequelize
│   │   ├── controllers/ # Controladores
│   │   ├── routes/      # Rutas de la API
│   │   ├── middleware/  # Middleware (auth, validación)
│   │   ├── validators/  # Validadores de datos
│   │   ├── utils/       # Utilidades (geocoding, geofencing)
│   │   └── bot/         # Bots (Telegram, WhatsApp)
│   └── package.json
│
├── frontend/             # Panel web React + Vite
│   ├── src/
│   │   ├── App.jsx      # Componente principal
│   │   ├── pages/       # Páginas (Dashboard, Locations, etc.)
│   │   ├── components/  # Componentes reutilizables
│   │   └── styles/      # Estilos CSS
│   └── package.json
│
├── mobile/               # App React Native
│   ├── src/
│   │   ├── config/      # Configuración (API)
│   │   ├── screens/     # Pantallas (Login, Tracking, etc.)
│   │   └── services/    # Servicios (LocationService)
│   ├── android/         # Proyecto Android nativo
│   ├── App.js           # Punto de entrada
│   └── package.json
│
├── docs/                 # Documentación (estás aquí)
│   ├── ARQUITECTURA.md
│   ├── GUIA_INSTALACION.md
│   ├── GUIA_USO.md
│   ├── API_REFERENCE.md
│   ├── FAQ.md
│   └── ...
│
├── scripts/              # Scripts útiles
│   ├── COMANDOS_ACTUALIZAR_RAILWAY.ps1
│   └── CONFIGURAR_RAILWAY.ps1
│
├── README.md             # Documentación principal
├── .gitignore            # Archivos ignorados por Git
└── Railway.toml          # Configuración Railway
```

## 🎯 Flujo de Lectura Recomendado

### Para Usuarios Nuevos

1. Lee el [README Principal](../README.md)
2. Sigue la [Guía de Instalación](GUIA_INSTALACION.md)
3. Consulta la [Guía de Uso](GUIA_USO.md)
4. Si tienes dudas, revisa las [FAQ](FAQ.md)

### Para Desarrolladores

1. Lee la [Arquitectura del Sistema](ARQUITECTURA.md)
2. Revisa el [API Reference](API_REFERENCE.md)
3. Consulta [Generar APK](GENERAR_APK.md) si trabajas en mobile
4. Sigue [Desplegar en Railway](GUIA_DESPLIEGUE_RAILWAY.md) para deployment

### Para Administradores

1. [Guía de Instalación](GUIA_INSTALACION.md) para setup del servidor
2. [Desplegar en Railway](GUIA_DESPLIEGUE_RAILWAY.md) para producción
3. [Guía Completa de Pruebas](GUIA_COMPLETA_PRUEBA_SISTEMA.md) para verificación

## 🔗 Enlaces Rápidos

### URLs de Producción

- **Backend API**: https://rastreoapp-production.up.railway.app
- **Frontend Web**: https://rastreoapp-frontend-production.up.railway.app
- **Health Check**: https://rastreoapp-production.up.railway.app/health

### Repositorios

- **GitHub**: [Tu repositorio aquí]
- **Railway**: Dashboard de proyectos

## 📞 Soporte

### Documentación

- [FAQ](FAQ.md) - Respuestas a preguntas comunes
- [API Reference](API_REFERENCE.md) - Referencia técnica completa
- [Arquitectura](ARQUITECTURA.md) - Entender el sistema

### Contacto

- **Issues de GitHub**: Para reportar bugs o solicitar features
- **Email**: soporte@rastreoapp.com
- **Documentación**: Consulta estos archivos

## 🔄 Actualizaciones

Esta documentación se actualiza constantemente. Última actualización: **Noviembre 2025**

## 📝 Contribuir a la Documentación

Si encuentras errores o quieres mejorar la documentación:

1. Fork el repositorio
2. Edita los archivos en `docs/`
3. Envía un Pull Request

## ✨ Características Documentadas

Toda la documentación cubre:

- ✅ Instalación y configuración
- ✅ Uso de todas las funcionalidades
- ✅ API completa con ejemplos
- ✅ Arquitectura del sistema
- ✅ Despliegue en producción
- ✅ Generación de APK
- ✅ Integraciones (Telegram)
- ✅ Solución de problemas
- ✅ FAQ completo

## 🎓 Recursos de Aprendizaje

### Tecnologías Utilizadas

- **Node.js**: https://nodejs.org/docs
- **Express.js**: https://expressjs.com/
- **React**: https://react.dev/
- **React Native**: https://reactnative.dev/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Sequelize**: https://sequelize.org/docs/
- **Leaflet**: https://leafletjs.com/
- **Expo**: https://docs.expo.dev/

### Tutoriales Relacionados

- REST APIs con Express
- React para principiantes
- React Native: primera app
- PostgreSQL básico
- Despliegue en Railway

## 📊 Métricas del Proyecto

- **Líneas de código**: ~8,000+
- **Endpoints API**: 25+
- **Páginas web**: 7
- **Pantallas móviles**: 3
- **Modelos de datos**: 5
- **Archivos de documentación**: 15+

## 🏆 Proyecto Académico

Este proyecto fue desarrollado como parte del **Taller 2** del curso de **Redes de Computadores - MCIC**.

**Universidad**: [Tu Universidad]  
**Curso**: Redes MCIC  
**Fecha**: Noviembre 2025  
**Estudiante**: [Tu Nombre]

---

**📚 ¿Tienes preguntas?**

Consulta las [FAQ](FAQ.md) o abre un issue en GitHub.

**🚀 ¡Empieza explorando la documentación!**

