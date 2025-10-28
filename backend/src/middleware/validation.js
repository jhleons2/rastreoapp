const { validationResult } = require('express-validator');

/**
 * Middleware para manejar errores de validación
 * Debe usarse después de los validadores de express-validator
 */
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      errors: errors.array(),
      message: 'Por favor verifica los datos enviados'
    });
  }
  
  next();
};

/**
 * Sanitiza datos de entrada
 * Elimina espacios en blanco y normaliza strings
 */
exports.sanitizeInput = (req, res, next) => {
  // Sanitizar todos los campos de tipo string
  Object.keys(req.body).forEach(key => {
    if (typeof req.body[key] === 'string') {
      req.body[key] = req.body[key].trim();
    }
  });
  
  next();
};

