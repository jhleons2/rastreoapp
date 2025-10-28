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

    // Validar datos
    if (!phone_number) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

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
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone_number, password } = req.body;

    if (!phone_number) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Buscar usuario
    const user = await User.findOne({ where: { phone_number } });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verificar password si existe
    if (password && user.password_hash) {
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }

    // Generar token
    const token = generateToken(user.id);

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
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Device, as: 'devices' }]
    });

    res.json({
      id: user.id,
      phone_number: user.phone_number,
      email: user.email,
      devices: user.devices || []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

