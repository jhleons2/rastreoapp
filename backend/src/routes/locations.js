const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { authenticate } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authenticate);

router.post('/', locationController.createLocation);
router.get('/device/:device_id', locationController.getLocations);
router.get('/device/:device_id/current', locationController.getCurrentLocation);

module.exports = router;

