# Script de Prueba Rápida - Verificar Ubicaciones

## 🔧 Prueba desde el Navegador

Abre la consola del navegador (F12) en la página del frontend y ejecuta este código:

### 1. Obtener tu token y verificar dispositivos

```javascript
// Ver tu token
const token = localStorage.getItem('token');
console.log('Token:', token ? '✅ Existe' : '❌ No existe');

// Ver dispositivos
fetch('https://rastreoapp-production.up.railway.app/api/devices', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(devices => {
  console.log('📱 Dispositivos:', devices);
  console.log('IDs de dispositivos:', devices.map(d => d.id));
});
```

### 2. Ver ubicaciones de un dispositivo específico

```javascript
// Reemplaza DEVICE_ID con el ID real de tu dispositivo (ej: 1, 2, 3, etc.)
const DEVICE_ID = 1; // ⚠️ CAMBIAR ESTO

const token = localStorage.getItem('token');

fetch(`https://rastreoapp-production.up.railway.app/api/locations/device/${DEVICE_ID}`, {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => {
  console.log('Status:', r.status);
  return r.json();
})
.then(locations => {
  console.log(`📍 Total ubicaciones: ${locations.length}`);
  
  if (locations.length > 0) {
    console.log('✅ Primera ubicación:', {
      latitude: locations[0].latitude,
      longitude: locations[0].longitude,
      timestamp: locations[0].timestamp,
      device_id: locations[0].device_id
    });
    
    console.log('✅ Última ubicación:', {
      latitude: locations[locations.length - 1].latitude,
      longitude: locations[locations.length - 1].longitude,
      timestamp: locations[locations.length - 1].timestamp
    });
    
    console.table(locations.slice(0, 5)); // Mostrar las primeras 5
  } else {
    console.log('❌ No hay ubicaciones para este dispositivo');
    console.log('Posibles causas:');
    console.log('  - La app móvil no ha enviado ubicaciones');
    console.log('  - El device_id no coincide');
    console.log('  - Los datos se están enviando a otro usuario');
  }
})
.catch(err => {
  console.error('❌ Error:', err);
});
```

### 3. Verificar todas las ubicaciones (de todos tus dispositivos)

```javascript
const token = localStorage.getItem('token');

// Primero obtener todos los dispositivos
fetch('https://rastreoapp-production.up.railway.app/api/devices', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(async devices => {
  console.log(`📱 Tienes ${devices.length} dispositivo(s)`);
  
  // Para cada dispositivo, obtener sus ubicaciones
  for (const device of devices) {
    console.log(`\n🔍 Verificando dispositivo: ${device.device_name} (ID: ${device.id})`);
    
    const response = await fetch(
      `https://rastreoapp-production.up.railway.app/api/locations/device/${device.id}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    const locations = await response.json();
    console.log(`  📍 Ubicaciones: ${locations.length}`);
    
    if (locations.length > 0) {
      const lastLocation = locations[0];
      console.log(`  ⏰ Última ubicación: ${new Date(lastLocation.timestamp).toLocaleString('es-ES')}`);
      console.log(`  📍 Coordenadas: ${lastLocation.latitude}, ${lastLocation.longitude}`);
    }
  }
});
```

## 🔍 Interpretación de Resultados

### ✅ Si ves ubicaciones:
```
📍 Total ubicaciones: 15
✅ Primera ubicación: {...}
```
**Significa:** El backend tiene datos. El problema es que el frontend no los está mostrando correctamente. Solución:
1. Presiona Ctrl+Shift+R para forzar recarga del frontend
2. Verifica que estés seleccionando el dispositivo correcto
3. Presiona el botón "Refrescar"

### ❌ Si ves 0 ubicaciones:
```
📍 Total ubicaciones: 0
❌ No hay ubicaciones para este dispositivo
```
**Significa:** El backend no tiene datos. Posibles causas:
1. La app móvil no ha enviado ubicaciones
2. El rastreo no está activo
3. Hay problemas con permisos GPS

**Acciones:**
1. Abre la app móvil
2. Verifica que diga "RASTREO ACTIVO"
3. Espera 1 minuto
4. Ejecuta el script nuevamente

### ⚠️ Si ves error 401:
```
❌ Error: 401 Unauthorized
```
**Significa:** Tu token expiró.

**Solución:**
1. Cierra sesión en el frontend
2. Inicia sesión nuevamente
3. Ejecuta el script nuevamente

### ⚠️ Si ves error 404:
```
❌ Error: 404 Device not found
```
**Significa:** El device_id no existe o no pertenece a tu usuario.

**Solución:**
1. Ejecuta el script del paso 1 para ver tus dispositivos
2. Usa uno de los IDs que aparecen
3. Ejecuta el script del paso 2 con el ID correcto

## 📱 Verificar deviceId en la App Móvil

Si tienes acceso a la consola de depuración de la app (por ejemplo, usando React Native Debugger o Flipper):

```javascript
// Ver el deviceId guardado en AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

AsyncStorage.getItem('deviceId').then(id => {
  console.log('Device ID en app móvil:', id);
});

// Ver si está rastreando
AsyncStorage.getItem('isTracking').then(tracking => {
  console.log('¿Está rastreando?:', tracking);
});
```

## 🚀 Prueba Completa End-to-End

Sigue estos pasos en orden:

1. **App Móvil**: Inicia sesión y presiona "INICIAR RASTREO"
2. **Espera 1 minuto** (la app envía cada 1 minuto)
3. **Consola del navegador**: Ejecuta el script del paso 3 (verificar todas las ubicaciones)
4. **Frontend**: Abre la página de Ubicaciones y presiona "Refrescar"

Si después de estos pasos NO aparecen ubicaciones:

### A. Verificar que la app está enviando
- ¿La app muestra tus coordenadas en pantalla?
- ¿El GPS está activado?
- ¿La app tiene permisos de ubicación?

### B. Verificar conectividad
```javascript
// Probar que el backend está funcionando
fetch('https://rastreoapp-production.up.railway.app/health')
  .then(r => r.json())
  .then(data => console.log('Backend health:', data));
```

### C. Verificar que el usuario es el mismo
- ¿Iniciaste sesión con el mismo email/contraseña en la app y en el frontend?
- Los dispositivos y ubicaciones están asociados a usuarios específicos

## 💡 Script de Depuración Completo

Copia y pega esto en la consola del navegador para un diagnóstico completo:

```javascript
(async function diagnosticar() {
  console.log('🔍 DIAGNÓSTICO COMPLETO - UBICACIONES\n');
  console.log('='.repeat(50));
  
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  console.log('\n1️⃣ USUARIO');
  console.log('Token:', token ? '✅ Existe' : '❌ No existe');
  console.log('Email:', user.email || 'No disponible');
  console.log('User ID:', user.id || 'No disponible');
  
  if (!token) {
    console.error('❌ No hay token. Por favor inicia sesión.');
    return;
  }
  
  console.log('\n2️⃣ DISPOSITIVOS');
  try {
    const devicesRes = await fetch('https://rastreoapp-production.up.railway.app/api/devices', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const devices = await devicesRes.json();
    console.log(`Total dispositivos: ${devices.length}`);
    devices.forEach(d => {
      console.log(`  - ${d.device_name || 'Sin nombre'} (ID: ${d.id}, Tipo: ${d.device_type})`);
      console.log(`    Última conexión: ${d.last_seen || 'Nunca'}`);
    });
    
    console.log('\n3️⃣ UBICACIONES');
    for (const device of devices) {
      const locRes = await fetch(
        `https://rastreoapp-production.up.railway.app/api/locations/device/${device.id}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const locations = await locRes.json();
      
      console.log(`\n  Dispositivo: ${device.device_name} (ID: ${device.id})`);
      console.log(`  📍 Total ubicaciones: ${locations.length}`);
      
      if (locations.length > 0) {
        const ultima = locations[0];
        console.log(`  ✅ Última ubicación:`);
        console.log(`     Timestamp: ${new Date(ultima.timestamp).toLocaleString('es-ES')}`);
        console.log(`     Coordenadas: ${ultima.latitude}, ${ultima.longitude}`);
        console.log(`     Precisión: ${ultima.accuracy}m`);
      } else {
        console.log(`  ❌ No hay ubicaciones registradas`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ Diagnóstico completado');
})();
```

## 📝 Resultado Esperado

Deberías ver algo como:

```
🔍 DIAGNÓSTICO COMPLETO - UBICACIONES
==================================================

1️⃣ USUARIO
Token: ✅ Existe
Email: usuario@ejemplo.com
User ID: 1

2️⃣ DISPOSITIVOS
Total dispositivos: 1
  - android Device (ID: 1, Tipo: mobile)
    Última conexión: 2025-11-05T10:30:00.000Z

3️⃣ UBICACIONES

  Dispositivo: android Device (ID: 1)
  📍 Total ubicaciones: 25
  ✅ Última ubicación:
     Timestamp: 5/11/2025, 10:35:00
     Coordenadas: 4.123456, -74.123456
     Precisión: 15m

==================================================
✅ Diagnóstico completado
```

Si ves esto, ¡los datos están en el backend! Solo necesitas refrescar el frontend. 🎉

