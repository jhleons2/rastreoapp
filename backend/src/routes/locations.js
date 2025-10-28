const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { authenticate } = require('../middleware/auth');
const { validateCreateLocation, validateGetLocations, validateGetCurrentLocation } = require('../validators/locationValidator');
const { handleValidationErrors } = require('../middleware/validation');

// Todas las rutas requieren autenticación
router.use(authenticate);

router.post('/', validateCreateLocation, handleValidationErrors, locationController.createLocation);
router.get('/device/:device_id', validateGetLocations, handleValidationErrors, locationController.getLocations);
router.get('/device/:device_id/current', validateGetCurrentLocation, handleValidationErrors, locationController.getCurrentLocation);

module.exports = router;

