const { Geofence, Device } = require('../models');

exports.getGeofences = async (req, res) => {
  try {
    const geofences = await Geofence.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: Device,
        as: 'device',
        required: false
      }],
      order: [['created_at', 'DESC']]
    });

    res.json(geofences);
  } catch (error) {
    console.error('Get geofences error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getGeofence = async (req, res) => {
  try {
    const { id } = req.params;

    const geofence = await Geofence.findOne({
      where: { id, user_id: req.user.id },
      include: [{
        model: Device,
        as: 'device',
        required: false
      }]
    });

    if (!geofence) {
      return res.status(404).json({ error: 'Geofence not found' });
    }

    res.json(geofence);
  } catch (error) {
    console.error('Get geofence error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createGeofence = async (req, res) => {
  try {
    const { name, description, latitude, longitude, radius, device_id, alert_on_entry, alert_on_exit } = req.body;

    if (!name || !latitude || !longitude || !radius) {
      return res.status(400).json({ error: 'Name, latitude, longitude and radius are required' });
    }

    // Verificar que el dispositivo pertenece al usuario si se especifica
    if (device_id) {
      const device = await Device.findOne({ where: { id: device_id, user_id: req.user.id } });
      if (!device) {
        return res.status(404).json({ error: 'Device not found' });
      }
    }

    const geofence = await Geofence.create({
      user_id: req.user.id,
      device_id: device_id || null,
      name,
      description: description || null,
      latitude,
      longitude,
      radius,
      alert_on_entry: alert_on_entry !== undefined ? alert_on_entry : true,
      alert_on_exit: alert_on_exit !== undefined ? alert_on_exit : true,
      is_active: true
    });

    res.status(201).json(geofence);
  } catch (error) {
    console.error('Create geofence error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateGeofence = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const geofence = await Geofence.findOne({
      where: { id, user_id: req.user.id }
    });

    if (!geofence) {
      return res.status(404).json({ error: 'Geofence not found' });
    }

    await geofence.update(updates);

    res.json(geofence);
  } catch (error) {
    console.error('Update geofence error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteGeofence = async (req, res) => {
  try {
    const { id } = req.params;

    const geofence = await Geofence.findOne({
      where: { id, user_id: req.user.id }
    });

    if (!geofence) {
      return res.status(404).json({ error: 'Geofence not found' });
    }

    await geofence.destroy();

    res.json({ message: 'Geofence deleted successfully' });
  } catch (error) {
    console.error('Delete geofence error:', error);
    res.status(500).json({ error: error.message });
  }
};

