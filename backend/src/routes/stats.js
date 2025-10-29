const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { authenticate } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * GET /api/stats/device/:device_id
 * Obtener estadísticas detalladas de movimiento de un dispositivo
 * Query params: start_date, end_date (opcionales)
 */
router.get('/device/:device_id', statsController.getMovementStats);

/**
 * GET /api/stats/device/:device_id/summary
 * Obtener resumen rápido de estadísticas
 */
router.get('/device/:device_id/summary', statsController.getStatsSummary);

module.exports = router;

