# ❓ Preguntas Frecuentes (FAQ)

## 📱 Aplicación Móvil

### ¿En qué dispositivos funciona la app?

La aplicación funciona en dispositivos **Android 8.0 (Oreo) o superior**. Actualmente no hay versión para iOS, pero está en el roadmap.

### ¿Por qué no aparecen mis ubicaciones en el mapa?

**Posibles causas y soluciones**:

1. **El rastreo no está activo**
   - Abre la app y verifica que diga "RASTREO ACTIVO" (verde)
   - Si no, presiona "INICIAR RASTREO"

2. **Permisos GPS no concedidos**
   - Ve a Configuración → Aplicaciones → RastreoApp → Permisos → Ubicación
   - Selecciona "Permitir siempre"

3. **GPS desactivado**
   - Activa el GPS en la configuración rápida del teléfono

4. **No has esperado suficiente**
   - La primera ubicación se envía inmediatamente
   - Las siguientes cada 1 minuto
   - Espera al menos 1-2 minutos

5. **Diferentes cuentas**
   - Asegúrate de usar el mismo email/contraseña en app y web

6. **Sin conexión a internet**
   - La app necesita internet para enviar ubicaciones
   - Verifica tu conexión WiFi o datos móviles

### ¿Por qué la app consume mucha batería?

El GPS y las actualizaciones periódicas consumen batería. Para optimizar:

- **Ajusta el intervalo**: Cambia de 1 minuto a 5-10 minutos
- **Detén cuando no uses**: No dejes el rastreo activo innecesariamente
- **Modo de ahorro**: Usa precisión "Equilibrada" en vez de "Alta"

### ¿La app funciona en segundo plano?

Sí, pero con limitaciones en Android moderno:
- Funciona mejor si la app está abierta
- En background puede detenerse después de un tiempo
- Desactiva "Optimización de batería" para mejorar funcionamiento

### ¿Puedo cambiar el intervalo de envío?

El intervalo está configurado en 1 minuto actualmente. Para cambiarlo necesitas modificar el código y recompilar la APK.

### ¿Funciona sin internet?

**No**. La app necesita conexión a internet para enviar ubicaciones al servidor. El GPS puede obtener coordenadas sin internet, pero no se enviarán hasta tener conexión.

## 💻 Panel Web

### ¿Por qué no puedo iniciar sesión?

Verifica que:
- El email y contraseña sean correctos
- Hayas registrado una cuenta primero
- El backend esté funcionando (visita /health)

### ¿Cómo actualizo las ubicaciones en el mapa?

Hay dos formas:
1. **Automático**: Activa el checkbox "Auto-actualizar" (se actualiza cada 30 segundos)
2. **Manual**: Presiona el botón "🔄 Refrescar"

### ¿Puedo exportar el historial de ubicaciones?

Actualmente no está implementado, pero puedes:
- Tomar screenshots del mapa
- Copiar coordenadas de la lista
- Exportación CSV/KML está en el roadmap

### El mapa no carga

**Soluciones**:
- Refresca la página (Ctrl+R o F5)
- Limpia caché del navegador (Ctrl+Shift+R)
- Prueba en modo incógnito
- Prueba otro navegador
- Verifica tu conexión a internet

## 🔐 Cuenta y Seguridad

### ¿Puedo cambiar mi contraseña?

Actualmente no hay función de cambio de contraseña en la interfaz. Contacta al administrador.

### ¿Olvidé mi contraseña?

La recuperación de contraseña no está implementada aún. Deberás crear una nueva cuenta o contactar soporte.

### ¿Pueden otros ver mis ubicaciones?

**No**. Tus ubicaciones solo son visibles para:
- Tú (con tu cuenta)
- Nadie más, a menos que compartas tu cuenta (no recomendado)

Las ubicaciones están protegidas por autenticación JWT.

### ¿Es seguro usar el sistema?

Sí. El sistema incluye:
- Contraseñas encriptadas (bcrypt)
- Autenticación JWT
- Comunicación HTTPS
- Validación de datos
- Protección contra inyección SQL

## 🗺️ Geocercas

### ¿Qué son las geocercas?

Las geocercas son áreas geográficas circulares que generan alertas cuando un dispositivo entra o sale de ellas.

### ¿Cómo creo una geocerca?

1. Ve a "Geocercas" en el menú
2. Click en "Nueva Geocerca"
3. Ingresa nombre, coordenadas y radio
4. Click en "Crear"

### ¿Cómo recibo alertas de geocercas?

Las alertas se envían por:
- Notificaciones web (si estás conectado)
- Bot de Telegram (si está configurado)

### ¿Cuántas geocercas puedo crear?

No hay límite actual, pero se recomienda máximo 10-20 por rendimiento.

## 🤖 Bot de Telegram

### ¿Cómo configuro el bot?

1. Busca `@TuBotRastreo` en Telegram
2. Envía `/start`
3. Sigue instrucciones para vincular tu cuenta
4. Envía `/link` con tu token

### ¿El bot es gratuito?

Sí, el bot es completamente gratuito.

### ¿Por qué el bot no responde?

Verifica que:
- Hayas iniciado el bot con `/start`
- Tu cuenta esté vinculada
- El backend esté funcionando
- El token del bot esté configurado correctamente

## 🔧 Técnico

### ¿Qué precisión tiene el GPS?

La precisión depende de:
- **Condiciones ideales** (al aire libre, cielo despejado): 3-5 metros
- **Condiciones normales**: 10-20 metros
- **Condiciones malas** (interior, edificios altos): 50-100+ metros

### ¿Cuántos datos consume?

Muy poco:
- Cada ubicación: ~1 KB
- 1 MB = ~1,000 ubicaciones
- Rastreo 24/7 por 1 mes: ~45 MB

### ¿Dónde se almacenan los datos?

Los datos se almacenan en:
- **Backend**: Base de datos PostgreSQL en Railway (Estados Unidos)
- **Móvil**: AsyncStorage local (token y configuración)
- **Web**: LocalStorage del navegador (token)

### ¿Puedo auto-hospedar el sistema?

Sí, el código es open source. Necesitas:
- Servidor con Node.js
- Base de datos PostgreSQL
- Compilar y distribuir la APK con tu URL

Ver [Guía de Instalación](GUIA_INSTALACION.md)

### ¿Puedo contribuir al proyecto?

¡Sí! El proyecto es open source:
1. Fork el repositorio
2. Crea una rama para tu feature
3. Haz tus cambios
4. Envía un Pull Request

Ver [Guía de Contribución](CONTRIBUTING.md)

## 🚀 Funcionalidades

### ¿Puedo rastrear múltiples dispositivos?

Sí, puedes registrar múltiples dispositivos en la misma cuenta. Cada uno aparecerá en el panel web.

### ¿Puedo compartir ubicaciones con otros?

Sí, usando:
- Link temporal (genera una URL que expira)
- Bot de Telegram (envía ubicación por mensaje)
- WhatsApp (próximamente)

### ¿Hay versión para iOS?

No actualmente, pero está en el roadmap para futuras versiones.

### ¿Hay app de escritorio?

No hay app nativa, pero el panel web funciona en todos los dispositivos con navegador moderno.

## 💰 Costos

### ¿Es gratis?

Sí, el sistema es completamente gratuito para uso académico. Railway ofrece un plan gratuito limitado.

### ¿Hay límites de uso?

Con el plan gratuito de Railway:
- 500 horas de ejecución/mes
- 1 GB de RAM
- 1 GB de almacenamiento en BD
- Suficiente para ~100,000 ubicaciones

## 🐛 Problemas Comunes

### Error: "Token expired"

Tu sesión expiró. Cierra sesión e inicia sesión nuevamente.

### Error: "Network Error"

Verifica:
- Tu conexión a internet
- Que el backend esté funcionando (/health)
- La URL de la API sea correcta

### Error: "Device not found"

El dispositivo no existe o no pertenece a tu cuenta. Verifica el device_id.

### Error: "Permission denied"

No tienes permisos para esa acción. Verifica que sea tu dispositivo/geocerca.

### El mapa muestra ubicaciones incorrectas

Esto puede pasar si:
- El GPS del teléfono no tiene buena señal
- Estás en interior o con obstáculos
- El teléfono tiene GPS defectuoso

**Solución**: Ve a un lugar abierto y espera a que mejore la precisión.

## 📞 Soporte

### ¿Cómo reporto un bug?

1. Abre un issue en GitHub
2. Describe el problema detalladamente
3. Incluye pasos para reproducirlo
4. Adjunta screenshots si es posible

### ¿Cómo solicito una funcionalidad?

Abre un issue en GitHub con la etiqueta "enhancement" y describe la funcionalidad deseada.

### ¿Dónde encuentro más ayuda?

- [Guía de Instalación](GUIA_INSTALACION.md)
- [Guía de Uso](GUIA_USO.md)
- [Arquitectura](ARQUITECTURA.md)
- [API Reference](API_REFERENCE.md)
- GitHub Issues
- Email: soporte@rastreoapp.com

## 🗺️ Roadmap

### ¿Qué funcionalidades están planeadas?

- [ ] Soporte iOS
- [ ] Exportar historial (CSV, KML, GPX)
- [ ] Modo offline
- [ ] Notificaciones push
- [ ] Compartir por WhatsApp
- [ ] Análisis de rutas
- [ ] Gráficos de velocidad/altitud
- [ ] Multi-idioma
- [ ] Temas dark/light
- [ ] Recuperación de contraseña

### ¿Cuándo saldrá la versión iOS?

No hay fecha confirmada aún. Depende del tiempo y recursos disponibles.

---

**¿Tu pregunta no está aquí?**

Abre un issue en GitHub o contacta: soporte@rastreoapp.com

**Última actualización**: Noviembre 2025

