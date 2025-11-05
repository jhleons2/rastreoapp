const { Location, Device } = require('../models');
const { Op } = require('sequelize');
const { reverseGeocode } = require('../utils/geocoding');

exports.createLocation = async (req, res) => {
  try {
    console.log('📍📍📍 LOCATION REQUEST RECEIVED 📍📍📍');
    console.log('Body:', req.body);
    console.log('User:', req.user?.id);
    
    const { device_id, latitude, longitude, accuracy, altitude, speed, heading } = req.body;

    console.log('📍 Processing location for device:', device_id);

    if (!device_id || !latitude || !longitude) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        error: 'Device ID, latitude and longitude are required' 
      });
    }

    // Verificar que el dispositivo existe y pertenece al usuario
    const device = await Device.findOne({ 
      where: { id: device_id, user_id: req.user.id }
    });

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    // Obtener dirección mediante geocodificación inversa (async sin bloquear)
    let address = null;
    try {
      const addressData = await reverseGeocode(parseFloat(latitude), parseFloat(longitude));
      if (addressData && addressData.address && addressData.address !== 'Error al obtener dirección') {
        address = addressData.address;
        console.log('✅ Dirección obtenida:', address);
      }
    } catch (error) {
      console.warn('⚠️ Error en geocodificación inversa (continuando sin dirección):', error.message);
      // Continuamos sin dirección si falla - no es crítico
    }

    // Crear ubicación con dirección si está disponible
    const locationData = {
      device_id,
      latitude,
      longitude,
      accuracy: accuracy || null,
      altitude: altitude || null,
      speed: speed || null,
      heading: heading || null,
      address: address || null,
      timestamp: new Date()
    };

    const location = await Location.create(locationData);
    console.log('✅ Location created successfully with ID:', location.id);

    // Actualizar last_seen del dispositivo
    await device.update({ last_seen: new Date() });
    console.log('✅ Device last_seen updated');

    res.status(201).json(location);
  } catch (error) {
    console.error('Create location error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getLocations = async (req, res) => {
  try {
    const { device_id } = req.params;
    const { start_date, end_date, limit = 100 } = req.query;

    console.log(`📍 GET Locations - Device ID: ${device_id}, User ID: ${req.user?.id}`);

    // Verificar que el dispositivo pertenece al usuario
    const device = await Device.findOne({
      where: { id: device_id, user_id: req.user.id }
    });

    if (!device) {
      console.log(`❌ Device ${device_id} not found for user ${req.user.id}`);
      return res.status(404).json({ error: 'Device not found' });
    }

    const where = { device_id };
    
    // Filtrar por fecha si se proporciona
    if (start_date && end_date) {
      where.timestamp = {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      };
    }

    // Intentar obtener ubicaciones
    // Si la columna address no existe, Sequelize puede fallar
    // Usamos try-catch específico para manejar esto
    let locations;
    try {
      locations = await Location.findAll({
        where,
        order: [['timestamp', 'DESC']],
        limit: parseInt(limit)
      });
    } catch (dbError) {
      // Si el error es sobre una columna inexistente (address), intentar sin esa columna
      if (dbError.message && dbError.message.includes('address')) {
        console.warn('⚠️ Columna address no existe, obteniendo ubicaciones sin address...');
        try {
          locations = await Location.findAll({
            where,
            order: [['timestamp', 'DESC']],
            limit: parseInt(limit),
            attributes: ['id', 'device_id', 'latitude', 'longitude', 'accuracy', 'altitude', 'speed', 'heading', 'timestamp']
          });
        } catch (secondError) {
          console.error('❌ Error obteniendo ubicaciones:', secondError);
          throw secondError;
        }
      } else {
        throw dbError;
      }
    }

    console.log(`✅ Found ${locations.length} locations for device ${device_id}`);
    res.json(locations);
  } catch (error) {
    console.error('❌ Get locations error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      error: 'Error al obtener ubicaciones',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getCurrentLocation = async (req, res) => {
  try {
    const { device_id } = req.params;

    console.log(`📍 GET Current Location - Device ID: ${device_id}, User ID: ${req.user?.id}`);

    const device = await Device.findOne({
      where: { id: device_id, user_id: req.user.id }
    });

    if (!device) {
      console.log(`❌ Device ${device_id} not found for user ${req.user.id}`);
      return res.status(404).json({ error: 'Device not found' });
    }

    let location;
    try {
      location = await Location.findOne({
        where: { device_id },
        order: [['timestamp', 'DESC']]
      });
    } catch (dbError) {
      // Si el error es sobre columna address, intentar sin ella
      if (dbError.message && dbError.message.includes('address')) {
        console.warn('⚠️ Columna address no existe, obteniendo ubicación sin address...');
        location = await Location.findOne({
          where: { device_id },
          order: [['timestamp', 'DESC']],
          attributes: ['id', 'device_id', 'latitude', 'longitude', 'accuracy', 'altitude', 'speed', 'heading', 'timestamp']
        });
      } else {
        throw dbError;
      }
    }

    if (!location) {
      console.log(`❌ No location found for device ${device_id}`);
      return res.status(404).json({ error: 'No location found for this device' });
    }

    console.log(`✅ Current location found for device ${device_id}`);
    res.json(location);
  } catch (error) {
    console.error('❌ Get current location error:', error);
    res.status(500).json({ 
      error: 'Error al obtener ubicación actual',
      message: error.message
    });
  }
};

exports.exportLocationsCSV = async (req, res) => {
  try {
    const { device_id } = req.params;
    const { start_date, end_date } = req.query;

    console.log(`📊 Exportando CSV - Device ID: ${device_id}, User ID: ${req.user?.id}`);

    // Verificar que el dispositivo pertenece al usuario
    const device = await Device.findOne({
      where: { id: device_id, user_id: req.user.id }
    });

    if (!device) {
      console.log(`❌ Device ${device_id} not found for user ${req.user.id}`);
      return res.status(404).json({ error: 'Device not found' });
    }

    const where = { device_id };
    
    // Filtrar por fecha si se proporciona
    if (start_date && end_date) {
      where.timestamp = {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      };
    }

    // Obtener ubicaciones
    let locations;
    try {
      locations = await Location.findAll({
        where,
        order: [['timestamp', 'ASC']],
        limit: 10000 // Límite razonable
      });
    } catch (dbError) {
      if (dbError.message && dbError.message.includes('address')) {
        locations = await Location.findAll({
          where,
          order: [['timestamp', 'ASC']],
          limit: 10000,
          attributes: ['id', 'device_id', 'latitude', 'longitude', 'accuracy', 'altitude', 'speed', 'heading', 'timestamp']
        });
      } else {
        throw dbError;
      }
    }

    if (locations.length === 0) {
      return res.status(404).json({ error: 'No locations found' });
    }

    // Generar CSV
    const headers = ['ID', 'Fecha', 'Hora', 'Latitud', 'Longitud', 'Precisión (m)', 'Altitud (m)', 'Velocidad (m/s)', 'Dirección (°)', 'Dirección'];
    const csvRows = [headers.join(',')];

    locations.forEach(loc => {
      const date = new Date(loc.timestamp);
      const row = [
        loc.id,
        date.toLocaleDateString('es-ES'),
        date.toLocaleTimeString('es-ES'),
        loc.latitude,
        loc.longitude,
        loc.accuracy || '',
        loc.altitude || '',
        loc.speed || '',
        loc.heading || '',
        loc.address ? `"${loc.address.replace(/"/g, '""')}"` : ''
      ];
      csvRows.push(row.join(','));
    });

    const csv = csvRows.join('\n');
    
    // Configurar headers para descarga
    const filename = `ubicaciones_${device.device_name || device_id}_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Agregar BOM para UTF-8 (para que Excel lo abra correctamente)
    res.write('\uFEFF');
    res.send(csv);

    console.log(`✅ CSV exportado: ${locations.length} ubicaciones`);
  } catch (error) {
    console.error('❌ Error exportando CSV:', error);
    res.status(500).json({ 
      error: 'Error al exportar CSV',
      message: error.message
    });
  }
};

