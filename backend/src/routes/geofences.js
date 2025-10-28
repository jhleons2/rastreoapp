const express = require('express');
const router = express.Router();
const geofenceController = require('../controllers/geofenceController');
const authenticate = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas
router.get('/', geofenceController.getGeofences);
router.get('/:id', geofenceController.getGeofence);
router.post('/', geofenceController.createGeofence);
router.put('/:id', geofenceController.updateGeofence);
router.delete('/:id', geofenceController.deleteGeofence);

module.exports = router;

