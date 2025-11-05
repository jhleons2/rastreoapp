# 📱 Guía de Uso - Sistema de Rastreo Geográfico

Esta guía te mostrará cómo usar todas las funcionalidades del sistema de rastreo.

## 🎯 Inicio Rápido

### Para Usuarios Nuevos

1. **Descargar APK** en tu teléfono Android
2. **Registrarte** con email y contraseña
3. **Permitir permisos** de ubicación
4. **Iniciar rastreo** con un click
5. **Ver ubicaciones** en el panel web

## 📱 Aplicación Móvil

### Registro de Usuario

1. Abre la app **RastreoApp**
2. Click en **"Registrarse"**
3. Ingresa:
   - Email válido
   - Contraseña (mínimo 6 caracteres)
4. Click en **"Crear Cuenta"**

### Iniciar Sesión

1. Ingresa tu email y contraseña
2. Click en **"Iniciar Sesión"**
3. La app te llevará a la pantalla principal

### Iniciar Rastreo

1. En la pantalla principal, verás el estado: **"RASTREO DETENIDO"**
2. Click en el botón **"▶️ INICIAR RASTREO"**
3. **Permitir permisos de ubicación** cuando se soliciten:
   - Android: Selecciona **"Permitir siempre"** o **"Permitir solo al usar la app"**
4. El estado cambiará a **"RASTREO ACTIVO"** (verde)
5. Verás tus coordenadas actuales en pantalla
6. La app enviará tu ubicación automáticamente cada 1 minuto

### Detener Rastreo

1. Click en el botón **"⏹️ DETENER RASTREO"**
2. Confirma la acción
3. El estado cambiará a **"RASTREO DETENIDO"** (rojo)

### Cerrar Sesión

1. Click en **"Cerrar Sesión"** en la esquina superior
2. Confirma la acción
3. Si el rastreo está activo, se detendrá automáticamente

### Permisos GPS

**Importante**: Para que el rastreo funcione correctamente:

1. **Activar GPS** en el dispositivo
2. **Permitir ubicación precisa**:
   - Android: Configuración → Aplicaciones → RastreoApp → Permisos → Ubicación
   - Seleccionar "Permitir siempre" para mejor funcionamiento
3. **Desactivar optimización de batería** (recomendado):
   - Configuración → Batería → Optimización de batería
   - Buscar RastreoApp → No optimizar

## 💻 Panel Web

### Acceso

1. Abre tu navegador
2. Ve a la URL del frontend (ej: `https://rastreoapp-frontend.up.railway.app`)
3. Inicia sesión con las **mismas credenciales** de la app móvil

### Dashboard Principal

Al iniciar sesión, verás el dashboard con:

- **📊 Total de Dispositivos**: Cuántos dispositivos tienes registrados
- **📍 Total de Ubicaciones**: Cuántas ubicaciones se han registrado
- **🗺️ Geocercas Activas**: Cuántas geocercas tienes configuradas
- **📈 Estadísticas**: Gráficos de actividad

### Ver Ubicaciones en Mapa

1. Click en **"Ubicaciones"** en el menú lateral
2. Selecciona un dispositivo del dropdown
3. El mapa mostrará:
   - **Marcadores**: Cada punto de ubicación
   - **Línea azul**: Trayectoria recorrida
   - **Popups**: Click en marcador para ver detalles

#### Controles del Mapa

- **🔄 Refrescar**: Actualizar ubicaciones manualmente
- **✓ Auto-actualizar**: Activar/desactivar actualización automática cada 30 segundos
- **Zoom**: Scroll del mouse o controles del mapa
- **Pan**: Arrastra el mapa con el mouse
- **Marcador**: Click para ver detalles (fecha, hora, precisión)

#### Lista de Ubicaciones

Debajo del mapa verás una lista con:
- Coordenadas (latitud, longitud)
- Fecha y hora de captura
- Precisión en metros
- Dirección (si está disponible)

### Gestionar Dispositivos

1. Click en **"Dispositivos"** en el menú
2. Verás la lista de tus dispositivos con:
   - Nombre del dispositivo
   - Tipo (móvil, GPS, etc.)
   - Estado (activo/inactivo)
   - Última conexión

#### Crear Nuevo Dispositivo

1. Click en **"Nuevo Dispositivo"**
2. Ingresa:
   - Nombre descriptivo
   - Tipo de dispositivo
3. Click en **"Crear"**

#### Editar Dispositivo

1. Click en el botón de editar (✏️)
2. Modifica los campos necesarios
3. Click en **"Guardar"**

#### Eliminar Dispositivo

1. Click en el botón de eliminar (🗑️)
2. Confirma la acción
3. Se eliminarán también todas sus ubicaciones

### Configurar Geocercas

Las geocercas son áreas geográficas que generan alertas cuando un dispositivo entra o sale.

#### Crear Geocerca

1. Click en **"Geocercas"** en el menú
2. Click en **"Nueva Geocerca"**
3. Ingresa:
   - **Nombre**: Descriptivo (ej: "Casa", "Oficina")
   - **Latitud**: Coordenada central
   - **Longitud**: Coordenada central  
   - **Radio**: Distancia en metros (ej: 100)
4. Click en **"Crear"**

#### Editar/Eliminar Geocerca

- Editar: Click en ✏️
- Eliminar: Click en 🗑️
- Activar/Desactivar: Toggle en la lista

#### Recibir Alertas

Las alertas se envían por:
- **Notificación web** (si estás conectado)
- **Telegram** (si configurado)
- **Email** (próximamente)

### Compartir Ubicación

1. Click en **"Compartir Ubicación"**
2. Selecciona un dispositivo
3. Opciones de compartir:
   - **Telegram**: Envía ubicación actual por bot
   - **Link temporal**: Genera URL para compartir
   - **WhatsApp**: Comparte por mensaje (próximamente)

### Estadísticas

1. Click en **"Estadísticas"** en el menú
2. Verás:
   - **Mapa de calor**: Zonas más visitadas
   - **Distancia recorrida**: Total por período
   - **Tiempo de actividad**: Horas con rastreo activo
   - **Gráficos de actividad**: Por día/semana/mes

## 🤖 Bot de Telegram

### Configurar Bot

1. Busca `@TuBotRastreo` en Telegram
2. Inicia conversación con `/start`
3. Vincula tu cuenta con `/link`
4. Sigue las instrucciones

### Comandos Disponibles

- `/start` - Iniciar bot y ver menú
- `/link` - Vincular cuenta de usuario
- `/location` - Solicitar ubicación actual
- `/devices` - Ver dispositivos registrados
- `/alerts` - Configurar alertas
- `/help` - Ayuda y comandos

### Recibir Ubicaciones

1. Envia `/location` al bot
2. Selecciona un dispositivo
3. El bot enviará:
   - Ubicación en el mapa (pin)
   - Coordenadas exactas
   - Link a Google Maps
   - Hora de captura

### Alertas Automáticas

El bot te notificará cuando:
- Un dispositivo entre/salga de una geocerca
- Un dispositivo se desconecte por mucho tiempo
- Batería baja (próximamente)

## 🔔 Notificaciones

### Tipos de Notificaciones

1. **Geocercas**:
   - "Dispositivo X entró a geocerca Casa"
   - "Dispositivo X salió de geocerca Oficina"

2. **Dispositivos**:
   - "Dispositivo X se conectó"
   - "Dispositivo X desconectado hace 2 horas"

3. **Sistema**:
   - "Nueva ubicación registrada"
   - "Error al obtener ubicación"

### Configurar Notificaciones

En el panel web:

1. Click en tu perfil (esquina superior derecha)
2. **Configuración** → **Notificaciones**
3. Activa/desactiva:
   - Notificaciones de geocercas
   - Notificaciones de dispositivos
   - Notificaciones por email
   - Notificaciones push

## 📊 Casos de Uso

### Uso Personal - Rastrear tu Teléfono

1. Instala la app en tu teléfono
2. Regístrate e inicia rastreo
3. Si pierdes el teléfono:
   - Abre el panel web
   - Ve a "Ubicaciones"
   - Verás la última ubicación conocida

### Uso Familiar - Rastrear Familiar

1. Instala la app en el teléfono del familiar
2. Ambos usan la misma cuenta (mismo email/password)
3. En el panel web verás todos los dispositivos
4. Configura geocercas (ej: "Casa", "Escuela")
5. Recibe alertas cuando lleguen/salgan

### Uso Empresarial - Flota de Vehículos

1. Instala la app en cada vehículo (con tablet/teléfono)
2. Crea dispositivos con nombres descriptivos:
   - "Vehículo 1", "Vehículo 2", etc.
3. Monitorea rutas en tiempo real
4. Revisa historial de trayectorias
5. Analiza estadísticas de recorridos

### Uso Deportivo - Rutas de Ciclismo/Running

1. Inicia rastreo antes de tu actividad
2. La app registrará tu trayectoria
3. Al terminar, detén el rastreo
4. En el panel web:
   - Ve la ruta completa en el mapa
   - Revisa distancia recorrida
   - Analiza velocidad promedio
   - Exporta datos (próximamente)

## 🛠️ Tips y Mejores Prácticas

### Optimizar Batería

- **Ajustar intervalo**: En vez de 1 minuto, usa 5-10 minutos
- **Detener cuando no uses**: No dejes rastreo activo innecesariamente
- **Modo avión**: Desactiva cuando no necesites conectividad

### Mejorar Precisión GPS

- **Estar al aire libre**: GPS funciona mejor sin obstáculos
- **Activar "Alta precisión"**: En configuración de ubicación
- **Esperar señal**: Los primeros segundos pueden ser imprecisos

### Ahorrar Datos Móviles

- El envío de ubicaciones consume muy pocos datos (~1KB por punto)
- Con 100MB puedes enviar ~100,000 ubicaciones
- Usa WiFi cuando esté disponible

### Privacidad

- **No compartas credenciales**: Cada usuario debe tener su cuenta
- **Cierra sesión** en dispositivos compartidos
- **Revisa permisos**: Solo da acceso a apps confiables
- **Elimina datos antiguos**: Puedes eliminar ubicaciones históricas

## ❓ Preguntas Frecuentes

### ¿Por qué no aparecen mis ubicaciones?

1. Verifica que el rastreo esté **activo** (verde)
2. Verifica permisos GPS
3. Espera al menos 1 minuto
4. Refresca el panel web (botón 🔄)
5. Revisa que uses la misma cuenta en app y web

### ¿Funciona sin internet?

- La app **necesita internet** para enviar ubicaciones
- Puede almacenar ubicaciones offline y enviarlas después (próximamente)
- El GPS funciona sin internet, pero el envío requiere conexión

### ¿Puedo cambiar la frecuencia de envío?

Actualmente está fijada en 1 minuto. Para cambiarla:

1. Edita `mobile/src/services/LocationService.js`
2. Cambia `intervalTime = 10 * 60 * 1000` (10 minutos)
3. Recompila la APK

### ¿Funciona en segundo plano?

- En Android, funciona en background limitado
- Para mejor rendimiento, mantén la app abierta
- Desactiva "Optimización de batería" para la app

### ¿Puedo tener múltiples dispositivos?

Sí, puedes registrar ilimitados dispositivos en la misma cuenta:
- Múltiples teléfonos con la app
- Cada uno aparecerá en el panel web
- Todos envían a la misma cuenta

## 🆘 Soporte

Si tienes problemas:

1. Consulta las [FAQ completas](FAQ.md)
2. Revisa [Solucionar Problemas](SOLUCIONAR_PROBLEMAS.md)
3. Contacta soporte: soporte@rastreoapp.com
4. Abre un issue en GitHub

---

**¡Disfruta rastreando! 📍**

Para más información, consulta la [documentación completa](../README.md).

