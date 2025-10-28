const { Location, Device } = require('../models');
const { Op } = require('sequelize');
const { reverseGeocode } = require('../utils/geocoding');

exports.createLocation = async (req, res) => {
  try {
    const { device_id, latitude, longitude, accuracy, altitude, speed, heading } = req.body;

    if (!device_id || !latitude || !longitude) {
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

    // Obtener dirección mediante geocodificación inversa
    let addressData = null;
    try {
      addressData = await reverseGeocode(latitude, longitude);
    } catch (error) {
      console.error('Error in reverse geocoding:', error.message);
    }

    // Crear ubicación
    const locationData = {
      device_id,
      latitude,
      longitude,
      accuracy: accuracy || null,
      altitude: altitude || null,
      speed: speed || null,
      heading: heading || null,
      timestamp: new Date()
    };

    // Agregar información de dirección si está disponible
    if (addressData && addressData.address) {
      locationData.address = addressData.address;
      locationData.formatted_address = `${addressData.address_components.road || ''} ${addressData.address_components.house_number || ''}`.trim();
      locationData.address_components = addressData.address_components;
    }

    const location = await Location.create(locationData);

    // Actualizar last_seen del dispositivo
    await device.update({ last_seen: new Date() });

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

    // Verificar que el dispositivo pertenece al usuario
    const device = await Device.findOne({
      where: { id: device_id, user_id: req.user.id }
    });

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    const where = { device_id };
    
    // Filtrar por fecha si se proporciona
    if (start_date && end_date) {
      where.timestamp = {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      };
    }

    const locations = await Location.findAll({
      where,
      order: [['timestamp', 'DESC']],
      limit: parseInt(limit)
    });

    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCurrentLocation = async (req, res) => {
  try {
    const { device_id } = req.params;

    const device = await Device.findOne({
      where: { id: device_id, user_id: req.user.id }
    });

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    const location = await Location.findOne({
      where: { device_id },
      order: [['timestamp', 'DESC']]
    });

    if (!location) {
      return res.status(404).json({ error: 'No location found for this device' });
    }

    res.json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

