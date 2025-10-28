const { body } = require('express-validator');

/**
 * Validaciones para registro de usuario
 */
exports.validateRegister = [
  body('phone_number')
    .trim()
    .notEmpty()
    .withMessage('El número de teléfono es requerido')
    .isLength({ min: 10, max: 15 })
    .withMessage('El número de teléfono debe tener entre 10 y 15 caracteres')
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Formato de teléfono inválido. Ejemplo: +573001234567'),
  
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('El email no puede exceder 255 caracteres'),
  
  body('password')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número')
];

/**
 * Validaciones para inicio de sesión
 */
exports.validateLogin = [
  body('phone_number')
    .trim()
    .notEmpty()
    .withMessage('El número de teléfono es requerido')
    .isLength({ min: 10, max: 15 })
    .withMessage('El número de teléfono debe tener entre 10 y 15 caracteres'),
  
  body('password')
    .optional({ checkFalsy: true })
    .trim()
    .notEmpty()
    .withMessage('La contraseña es requerida si el usuario la tiene configurada')
];

/**
 * Validaciones para actualizar perfil
 */
exports.validateUpdateProfile = [
  body('phone_number')
    .optional()
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage('El número de teléfono debe tener entre 10 y 15 caracteres')
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Formato de teléfono inválido'),
  
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('El email no puede exceder 255 caracteres'),
  
  body('password')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
];

