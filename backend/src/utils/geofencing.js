/**
 * Utilidades para geofencing
 * Calcula distancias y detecta entradas/salidas de zonas
 */

/**
 * Calcular distancia entre dos puntos en metros usando la fórmula de Haversine
 * @param {number} lat1 - Latitud del primer punto
 * @param {number} lon1 - Longitud del primer punto
 * @param {number} lat2 - Latitud del segundo punto
 * @param {number} lon2 - Longitud del segundo punto
 * @returns {number} Distancia en metros
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Radio de la Tierra en metros
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

/**
 * Convertir grados a radianes
 * @param {number} degrees - Grados
 * @returns {number} Radianes
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Verificar si una ubicación está dentro de una geofence
 * @param {number} lat - Latitud de la ubicación
 * @param {number} lon - Longitud de la ubicación
 * @param {Object} geofence - Objeto geofence con lat, lon y radius
 * @returns {Object} { isInside: boolean, distance: number }
 */
function isInsideGeofence(lat, lon, geofence) {
  const distance = calculateDistance(
    parseFloat(lat),
    parseFloat(lon),
    parseFloat(geofence.latitude),
    parseFloat(geofence.longitude)
  );
  
  const radius = parseFloat(geofence.radius);
  
  return {
    isInside: distance <= radius,
    distance: Math.round(distance),
    radius
  };
}

/**
 * Detectar eventos de entrada y salida de geofence
 * @param {Array} previousLocation - Ubicación anterior
 * @param {Object} currentLocation - Ubicación actual
 * @param {Array} geofences - Array de geofences
 * @returns {Array} Array de eventos detectados
 */
function detectGeofenceEvents(previousLocation, currentLocation, geofences) {
  const events = [];
  
  geofences.forEach(geofence => {
    if (!geofence.is_active) return;
    
    const previousCheck = previousLocation 
      ? isInsideGeofence(previousLocation.latitude, previousLocation.longitude, geofence)
      : { isInside: false, distance: null };
    
    const currentCheck = isInsideGeofence(
      currentLocation.latitude,
      currentLocation.longitude,
      geofence
    );
    
    // Detectar entrada
    if (!previousCheck.isInside && currentCheck.isInside && geofence.alert_on_entry) {
      events.push({
        type: 'entry',
        geofence: geofence,
        location: currentLocation,
        distance: currentCheck.distance
      });
    }
    
    // Detectar salida
    if (previousCheck.isInside && !currentCheck.isInside && geofence.alert_on_exit) {
      events.push({
        type: 'exit',
        geofence: geofence,
        location: currentLocation,
        distance: currentCheck.distance
      });
    }
  });
  
  return events;
}

module.exports = {
  calculateDistance,
  isInsideGeofence,
  detectGeofenceEvents
};

