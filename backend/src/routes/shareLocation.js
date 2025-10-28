const express = require('express');
const router = express.Router();
const { Location, Device, User } = require('../models');
const { authenticate } = require('../middleware/auth');
const crypto = require('crypto');

// Generar token temporal para compartir ubicación (válido por 1 hora)
const shareTokens = new Map();

/**
 * Generar link para compartir ubicación
 * El admin genera un link y lo envía por WhatsApp/Telegram
 * El usuario hace clic en el link y comparte su ubicación
 */
router.post('/generate-share-link', authenticate, (req, res) => {
  try {
    const { device_id } = req.body;
    
    // Generar token único
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    
    shareTokens.set(token, {
      device_id,
      user_id: req.user.id,
      expiresAt,
      createdAt: new Date()
    });
    
    // Generar link
    const baseUrl = process.env.FRONTEND_URL || 'https://rastreoapp-frontend-production.up.railway.app';
    const shareLink = `${baseUrl}/share-location/${token}`;
    
    res.json({
      token,
      shareLink,
      expiresAt,
      expiresIn: '1 hora'
    });
  } catch (error) {
    console.error('Error generating share link:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Verificar token de compartir ubicación
 */
router.get('/verify-share-token/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const tokenData = shareTokens.get(token);
    
    if (!tokenData) {
      return res.json({ valid: false, error: 'Token inválido o expirado' });
    }
    
    if (new Date() > tokenData.expiresAt) {
      shareTokens.delete(token);
      return res.json({ valid: false, error: 'Token expirado' });
    }
    
    // Obtener información del dispositivo
    const device = await Device.findOne({
      where: { id: tokenData.device_id },
      include: [{ model: User, as: 'user', attributes: ['phone_number'] }]
    });
    
    res.json({
      valid: true,
      device: {
        id: device.id,
        name: device.device_name,
        type: device.device_type,
        phoneNumber: device.user?.phone_number
      }
    });
  } catch (error) {
    console.error('Error verifying share token:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Recibir ubicación compartida
 */
router.post('/share-location/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { latitude, longitude, accuracy, altitude, speed, heading } = req.body;
    
    const tokenData = shareTokens.get(token);
    
    if (!tokenData) {
      return res.status(400).json({ error: 'Token inválido' });
    }
    
    if (new Date() > tokenData.expiresAt) {
      shareTokens.delete(token);
      return res.status(400).json({ error: 'Token expirado' });
    }
    
    // Validar coordenadas
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitud y longitud son requeridas' });
    }
    
    // Crear ubicación
    const location = await Location.create({
      device_id: tokenData.device_id,
      latitude,
      longitude,
      accuracy: accuracy || null,
      altitude: altitude || null,
      speed: speed || null,
      heading: heading || null,
      timestamp: new Date()
    });
    
    // Actualizar last_seen del dispositivo
    await Device.update(
      { last_seen: new Date() },
      { where: { id: tokenData.device_id } }
    );
    
    // Eliminar token (solo puede usarse una vez)
    shareTokens.delete(token);
    
    res.json({
      success: true,
      message: 'Ubicación compartida exitosamente',
      location: {
        id: location.id,
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: location.timestamp
      }
    });
  } catch (error) {
    console.error('Error receiving shared location:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

