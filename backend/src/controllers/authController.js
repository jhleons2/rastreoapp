const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Device } = require('../models');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

exports.register = async (req, res) => {
  try {
    const { phone_number, email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { phone_number } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash de password si existe
    let password_hash = null;
    if (password) {
      password_hash = await bcrypt.hash(password, 10);
    }

    // Crear usuario
    const user = await User.create({
      phone_number,
      email: email || null,
      password_hash
    });

    // Generar token
    const token = generateToken(user.id);

    console.log('[register] Usuario creado:', {
      userId: user.id,
      phone: phone_number,
      timestamp: new Date().toISOString()
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        phone_number: user.phone_number,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('[register] Error:', {
      error: error.message,
      stack: error.stack,
      phone_number: req.body.phone_number,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone_number, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ where: { phone_number } });
    
    if (!user) {
      console.log('[login] Usuario no encontrado:', { phone_number });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verificar password si existe
    if (password && user.password_hash) {
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        console.log('[login] Contraseña incorrecta:', { userId: user.id, phone_number });
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }

    // Generar token
    const token = generateToken(user.id);

    console.log('[login] Login exitoso:', {
      userId: user.id,
      phone: phone_number,
      timestamp: new Date().toISOString()
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        phone_number: user.phone_number,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('[login] Error:', {
      error: error.message,
      stack: error.stack,
      phone_number: req.body.phone_number,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'phone_number', 'email', 'created_at', 'updated_at'],
      include: [{ 
        model: Device, 
        as: 'devices',
        required: false, // Left join - no falla si no hay devices
        attributes: ['id', 'device_name', 'device_type', 'is_active', 'last_seen', 'created_at']
      }]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      phone_number: user.phone_number,
      email: user.email,
      devices: user.devices || [],
      created_at: user.created_at,
      updated_at: user.updated_at
    });
  } catch (error) {
    console.error('[getProfile] Error:', {
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

