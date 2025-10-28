const { body, param, query } = require('express-validator');

/**
 * Validaciones para crear ubicación
 */
exports.validateCreateLocation = [
  body('device_id')
    .notEmpty()
    .withMessage('El ID del dispositivo es requerido')
    .isInt({ min: 1 })
    .withMessage('El ID del dispositivo debe ser un número válido'),
  
  body('latitude')
    .notEmpty()
    .withMessage('La latitud es requerida')
    .isFloat({ min: -90, max: 90 })
    .withMessage('La latitud debe estar entre -90 y 90'),
  
  body('longitude')
    .notEmpty()
    .withMessage('La longitud es requerida')
    .isFloat({ min: -180, max: 180 })
    .withMessage('La longitud debe estar entre -180 y 180'),
  
  body('accuracy')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('La precisión debe ser un número positivo')
    .isFloat({ max: 1000 })
    .withMessage('According must be reasonable (less than 1000 meters)'),
  
  body('altitude')
    .optional()
    .isFloat()
    .withMessage('La altitud debe ser un número válido'),
  
  body('speed')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('La velocidad debe ser un número positivo')
    .isFloat({ max: 200 })
    .withMessage('La velocidad debe ser realista (menos de 200 m/s)'),
  
  body('heading')
    .optional()
    .isFloat({ min: 0, max: 360 })
    .withMessage('La dirección debe estar entre 0 y 360 grados')
];

/**
 * Validaciones para obtener ubicaciones de un dispositivo
 */
exports.validateGetLocations = [
  param('device_id')
    .notEmpty()
    .withMessage('El ID del dispositivo es requerido')
    .isInt({ min: 1 })
    .withMessage('El ID del dispositivo debe ser un número válido'),
  
  query('start_date')
    .optional()
    .isISO8601()
    .withMessage('La fecha de inicio debe ser válida (ISO 8601)'),
  
  query('end_date')
    .optional()
    .isISO8601()
    .withMessage('La fecha de fin debe ser válida (ISO 8601)'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('El límite debe ser un número entre 1 y 1000')
];

/**
 * Validaciones para obtener ubicación actual
 */
exports.validateGetCurrentLocation = [
  param('device_id')
    .notEmpty()
    .withMessage('El ID del dispositivo es requerido')
    .isInt({ min: 1 })
    .withMessage('El ID del dispositivo debe ser un número válido')
];

