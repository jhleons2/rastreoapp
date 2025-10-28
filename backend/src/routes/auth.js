const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Ruta protegida
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;

