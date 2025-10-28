const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../validators/authValidator');
const { handleValidationErrors } = require('../middleware/validation');

// Rutas públicas
router.post('/register', validateRegister, handleValidationErrors, authController.register);
router.post('/login', validateLogin, handleValidationErrors, authController.login);

// Ruta protegida
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;

