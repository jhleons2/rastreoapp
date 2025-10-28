const { body, param } = require('express-validator');

/**
 * Validaciones para crear dispositivo
 */
exports.validateCreateDevice = [
  body('device_name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El nombre del dispositivo no puede exceder 100 caracteres'),
  
  body('device_type')
    .trim()
    .notEmpty()
    .withMessage('El tipo de dispositivo es requerido')
    .isIn(['mobile', 'tablet', 'watch', 'car', 'other'])
    .withMessage('Tipo de dispositivo inválido. Valores permitidos: mobile, tablet, watch, car, other')
];

/**
 * Validaciones para actualizar dispositivo
 */
exports.validateUpdateDevice = [
  param('device_id')
    .notEmpty()
    .withMessage('El ID del dispositivo es requerido')
    .isInt({ min: 1 })
    .withMessage('El ID del dispositivo debe ser un número válido'),
  
  body('device_name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El nombre del dispositivo no puede exceder 100 caracteres'),
  
  body('device_type')
    .optional()
    .trim()
    .isIn(['mobile', 'tablet', 'watch', 'car', 'other'])
    .withMessage('Tipo de dispositivo inválido. Valores permitidos: mobile, tablet, watch, car, other'),
  
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active debe ser un valor booleano')
];

/**
 * Validaciones para obtener o eliminar dispositivo
 */
exports.validateDeviceId = [
  param('device_id')
    .notEmpty()
    .withMessage('El ID del dispositivo es requerido')
    .isInt({ min: 1 })
    .withMessage('El ID del dispositivo debe ser un número válido')
];

