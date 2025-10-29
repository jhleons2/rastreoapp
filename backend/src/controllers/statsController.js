const { Location, Device } = require('../models');
const { Op } = require('sequelize');

/**
 * Calcular distancia entre dos puntos usando fórmula de Haversine
 * @param {number} lat1 - Latitud punto 1
 * @param {number} lon1 - Longitud punto 1
 * @param {number} lat2 - Latitud punto 2
 * @param {number} lon2 - Longitud punto 2
 * @returns {number} Distancia en metros
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radio de la Tierra en metros
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distancia en metros
}

/**
 * Calcular velocidad promedio entre dos ubicaciones
 * @param {Object} loc1 - Ubicación 1
 * @param {Object} loc2 - Ubicación 2
 * @returns {number} Velocidad en m/s
 */
function calculateSpeed(loc1, loc2) {
  const distance = calculateDistance(
    parseFloat(loc1.latitude),
    parseFloat(loc1.longitude),
    parseFloat(loc2.latitude),
    parseFloat(loc2.longitude)
  );
  
  const timeDiff = (new Date(loc2.timestamp) - new Date(loc1.timestamp)) / 1000; // segundos
  
  if (timeDiff <= 0) return 0;
  
  return distance / timeDiff; // m/s
}

/**
 * Obtener estadísticas de movimiento de un dispositivo
 * GET /api/stats/device/:device_id
 */
exports.getMovementStats = async (req, res) => {
  try {
    const { device_id } = req.params;
    const { start_date, end_date } = req.query;

    // Verificar que el dispositivo existe y pertenece al usuario
    const device = await Device.findOne({
      where: { id: device_id, user_id: req.user.id }
    });

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    // Construir condiciones de filtro
    const where = { device_id };
    
    if (start_date && end_date) {
      where.timestamp = {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      };
    }

    // Obtener todas las ubicaciones ordenadas por tiempo
    const locations = await Location.findAll({
      where,
      order: [['timestamp', 'ASC']]
    });

    if (locations.length === 0) {
      return res.json({
        device_id: parseInt(device_id),
        period: {
          start: start_date || null,
          end: end_date || null
        },
        summary: {
          total_locations: 0,
          total_distance: 0,
          average_speed: 0,
          max_speed: 0,
          total_time: 0,
          average_accuracy: 0
        },
        message: 'No se encontraron ubicaciones para este dispositivo'
      });
    }

    // Calcular estadísticas
    let totalDistance = 0; // en metros
    const speeds = [];
    const accuracies = [];
    let totalTime = 0; // en minutos

    // Calcular distancia y velocidad entre ubicaciones consecutivas
    for (let i = 1; i < locations.length; i++) {
      const loc1 = locations[i - 1];
      const loc2 = locations[i];

      // Distancia entre puntos
      const distance = calculateDistance(
        parseFloat(loc1.latitude),
        parseFloat(loc1.longitude),
        parseFloat(loc2.latitude),
        parseFloat(loc2.longitude)
      );
      totalDistance += distance;

      // Velocidad calculada
      const speed = calculateSpeed(loc1, loc2);
      speeds.push(speed);

      // Tiempo transcurrido
      const timeDiff = (new Date(loc2.timestamp) - new Date(loc1.timestamp)) / 1000 / 60; // minutos
      totalTime += timeDiff;

      // Usar velocidad del GPS si está disponible
      if (loc2.speed !== null && loc2.speed !== undefined) {
        speeds.push(parseFloat(loc2.speed));
      }
    }

    // Agregar velocidades del GPS directamente
    locations.forEach(loc => {
      if (loc.speed !== null && loc.speed !== undefined) {
        speeds.push(parseFloat(loc.speed));
      }
      if (loc.accuracy !== null && loc.accuracy !== undefined) {
        accuracies.push(parseFloat(loc.accuracy));
      }
    });

    // Calcular promedios y máximos
    const averageSpeed = speeds.length > 0
      ? speeds.reduce((a, b) => a + b, 0) / speeds.length
      : 0;
    
    const maxSpeed = speeds.length > 0 ? Math.max(...speeds) : 0;
    
    const averageAccuracy = accuracies.length > 0
      ? accuracies.reduce((a, b) => a + b, 0) / accuracies.length
      : 0;

    // Tiempo total del periodo
    const periodStart = locations[0].timestamp;
    const periodEnd = locations[locations.length - 1].timestamp;
    const totalPeriodTime = (new Date(periodEnd) - new Date(periodStart)) / 1000 / 60; // minutos

    // Respuesta estructurada
    res.json({
      device_id: parseInt(device_id),
      device_name: device.name || 'Dispositivo sin nombre',
      period: {
        start: locations[0].timestamp,
        end: locations[locations.length - 1].timestamp,
        filtered: {
          start: start_date || null,
          end: end_date || null
        }
      },
      summary: {
        total_locations: locations.length,
        total_distance: {
          meters: parseFloat(totalDistance.toFixed(2)),
          kilometers: parseFloat((totalDistance / 1000).toFixed(3)),
          formatted: `${(totalDistance / 1000).toFixed(2)} km`
        },
        average_speed: {
          ms: parseFloat(averageSpeed.toFixed(2)),
          kmh: parseFloat((averageSpeed * 3.6).toFixed(2)),
          formatted: `${(averageSpeed * 3.6).toFixed(2)} km/h`
        },
        max_speed: {
          ms: parseFloat(maxSpeed.toFixed(2)),
          kmh: parseFloat((maxSpeed * 3.6).toFixed(2)),
          formatted: `${(maxSpeed * 3.6).toFixed(2)} km/h`
        },
        total_time: {
          minutes: parseFloat(totalTime.toFixed(2)),
          hours: parseFloat((totalTime / 60).toFixed(2)),
          formatted: `${(totalTime / 60).toFixed(1)} horas`
        },
        period_duration: {
          minutes: parseFloat(totalPeriodTime.toFixed(2)),
          hours: parseFloat((totalPeriodTime / 60).toFixed(2)),
          formatted: `${(totalPeriodTime / 60).toFixed(1)} horas`
        },
        average_accuracy: {
          meters: parseFloat(averageAccuracy.toFixed(2)),
          formatted: `${averageAccuracy.toFixed(1)} m`
        }
      },
      locations: {
        first: {
          latitude: parseFloat(locations[0].latitude),
          longitude: parseFloat(locations[0].longitude),
          timestamp: locations[0].timestamp,
          address: locations[0].address || null
        },
        last: {
          latitude: parseFloat(locations[locations.length - 1].latitude),
          longitude: parseFloat(locations[locations.length - 1].longitude),
          timestamp: locations[locations.length - 1].timestamp,
          address: locations[locations.length - 1].address || null
        }
      }
    });
  } catch (error) {
    console.error('Error calculating movement stats:', error);
    res.status(500).json({ 
      error: 'Error al calcular estadísticas',
      message: error.message 
    });
  }
};

/**
 * Obtener resumen rápido de estadísticas
 * GET /api/stats/device/:device_id/summary
 */
exports.getStatsSummary = async (req, res) => {
  try {
    const { device_id } = req.params;

    const device = await Device.findOne({
      where: { id: device_id, user_id: req.user.id }
    });

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    // Obtener última ubicación
    const lastLocation = await Location.findOne({
      where: { device_id },
      order: [['timestamp', 'DESC']]
    });

    // Contar total de ubicaciones
    const totalLocations = await Location.count({
      where: { device_id }
    });

    // Obtener primera ubicación
    const firstLocation = await Location.findOne({
      where: { device_id },
      order: [['timestamp', 'ASC']]
    });

    let totalDistance = 0;
    if (firstLocation && lastLocation && firstLocation.id !== lastLocation.id) {
      totalDistance = calculateDistance(
        parseFloat(firstLocation.latitude),
        parseFloat(firstLocation.longitude),
        parseFloat(lastLocation.latitude),
        parseFloat(lastLocation.longitude)
      );
    }

    res.json({
      device_id: parseInt(device_id),
      device_name: device.name || 'Dispositivo sin nombre',
      summary: {
        total_locations: totalLocations,
        last_seen: device.last_seen || null,
        first_location: firstLocation ? {
          timestamp: firstLocation.timestamp,
          address: firstLocation.address || null
        } : null,
        last_location: lastLocation ? {
          timestamp: lastLocation.timestamp,
          latitude: parseFloat(lastLocation.latitude),
          longitude: parseFloat(lastLocation.longitude),
          address: lastLocation.address || null
        } : null,
        approximate_distance: {
          meters: parseFloat(totalDistance.toFixed(2)),
          kilometers: parseFloat((totalDistance / 1000).toFixed(3))
        }
      }
    });
  } catch (error) {
    console.error('Error getting stats summary:', error);
    res.status(500).json({ 
      error: 'Error al obtener resumen',
      message: error.message 
    });
  }
};

