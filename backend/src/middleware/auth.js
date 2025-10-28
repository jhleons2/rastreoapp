const jwt = require('jsonwebtoken');
const { User, Device } = require('../models');

exports.authenticate = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No token provided',
        message: 'Token is required in Authorization header as: Bearer <token>'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que el usuario existe
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Agregar usuario al request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

// Verificar si el usuario puede acceder a un dispositivo específico
exports.canAccessDevice = async (req, res, next) => {
  try {
    const { device_id } = req.params;
    const device = await Device.findOne({ where: { id: device_id, user_id: req.user.id } });
    
    if (!device) {
      return res.status(404).json({ error: 'Device not found or access denied' });
    }
    
    req.device = device;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

