const { Device, User } = require('../models');

exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.findAll({
      where: { user_id: req.user.id },
      include: [{ model: User, as: 'user' }],
      order: [['created_at', 'DESC']]
    });

    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDevice = async (req, res) => {
  try {
    const { device_id } = req.params;

    const device = await Device.findOne({
      where: { id: device_id, user_id: req.user.id },
      include: [{ model: User, as: 'user' }]
    });

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    res.json(device);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createDevice = async (req, res) => {
  try {
    const { device_name, device_type } = req.body;

    if (!device_type) {
      return res.status(400).json({ error: 'Device type is required' });
    }

    const device = await Device.create({
      user_id: req.user.id,
      device_name: device_name || `Device ${Date.now()}`,
      device_type: device_type || 'mobile',
      is_active: true
    });

    res.status(201).json(device);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      return res.status(404).json({ error: 'Device not found' });
    }

    await device.update(updates);

    res.json(device);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDevice = async (req, res) => {
  try {
    const { device_id } = req.params;

    const device = await Device.findOne({
      where: { id: device_id, user_id: req.user.id }
    });

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    await device.destroy();

    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

