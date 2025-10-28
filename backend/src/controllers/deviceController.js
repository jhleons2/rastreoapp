const { Device, User } = require('../models');

exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.findAll({
      where: { user_id: req.user.id },
      attributes: ['id', 'user_id', 'device_name', 'device_type', 'is_active', 'last_seen', 'created_at', 'updated_at'],
      order: [['created_at', 'DESC']]
    });

    console.log('[getDevices] Dispositivos encontrados:', {
      userId: req.user.id,
      count: devices.length,
      timestamp: new Date().toISOString()
    });

    res.json(devices);
  } catch (error) {
    console.error('[getDevices] Error:', {
      error: error.message,
      stack: error.stack,
      userId: req.user.id,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getDevice = async (req, res) => {
  try {
    const { device_id } = req.params;

    const device = await Device.findOne({
      where: { id: device_id, user_id: req.user.id },
      attributes: ['id', 'user_id', 'device_name', 'device_type', 'is_active', 'last_seen', 'created_at', 'updated_at']
    });

    if (!device) {
      console.log('[getDevice] Dispositivo no encontrado:', { deviceId: device_id, userId: req.user.id });
      return res.status(404).json({ error: 'Device not found' });
    }

    console.log('[getDevice] Dispositivo encontrado:', {
      deviceId: device_id,
      userId: req.user.id,
      timestamp: new Date().toISOString()
    });

    res.json(device);
  } catch (error) {
    console.error('[getDevice] Error:', {
      error: error.message,
      stack: error.stack,
      deviceId: req.params.device_id,
      userId: req.user.id,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.createDevice = async (req, res) => {
  try {
    const { device_name, device_type } = req.body;

    const device = await Device.create({
      user_id: req.user.id,
      device_name: device_name || `Device ${Date.now()}`,
      device_type: device_type || 'mobile',
      is_active: true
    });

    console.log('[createDevice] Dispositivo creado:', {
      deviceId: device.id,
      userId: req.user.id,
      deviceName: device.device_name,
      timestamp: new Date().toISOString()
    });

    res.status(201).json(device);
  } catch (error) {
    console.error('[createDevice] Error:', {
      error: error.message,
      stack: error.stack,
      userId: req.user.id,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.updateDevice = async (req, res) => {
  try {
    const { device_id } = req.params;
    const updates = req.body;

    const device = await Device.findOne({
      where: { id: device_id, user_id: req.user.id }
    });

    if (!device) {
      console.log('[updateDevice] Dispositivo no encontrado:', { deviceId: device_id, userId: req.user.id });
      return res.status(404).json({ error: 'Device not found' });
    }

    await device.update(updates);

    console.log('[updateDevice] Dispositivo actualizado:', {
      deviceId: device_id,
      userId: req.user.id,
      updates,
      timestamp: new Date().toISOString()
    });

    res.json(device);
  } catch (error) {
    console.error('[updateDevice] Error:', {
      error: error.message,
      stack: error.stack,
      deviceId: req.params.device_id,
      userId: req.user.id,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.deleteDevice = async (req, res) => {
  try {
    const { device_id } = req.params;

    const device = await Device.findOne({
      where: { id: device_id, user_id: req.user.id }
    });

    if (!device) {
      console.log('[deleteDevice] Dispositivo no encontrado:', { deviceId: device_id, userId: req.user.id });
      return res.status(404).json({ error: 'Device not found' });
    }

    await device.destroy();

    console.log('[deleteDevice] Dispositivo eliminado:', {
      deviceId: device_id,
      userId: req.user.id,
      timestamp: new Date().toISOString()
    });

    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    console.error('[deleteDevice] Error:', {
      error: error.message,
      stack: error.stack,
      deviceId: req.params.device_id,
      userId: req.user.id,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

