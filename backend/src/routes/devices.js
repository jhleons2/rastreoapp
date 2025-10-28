const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const { authenticate } = require('../middleware/auth');
const { validateCreateDevice, validateUpdateDevice, validateDeviceId } = require('../validators/deviceValidator');
const { handleValidationErrors } = require('../middleware/validation');

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/', deviceController.getDevices);
router.get('/:device_id', validateDeviceId, handleValidationErrors, deviceController.getDevice);
router.post('/', validateCreateDevice, handleValidationErrors, deviceController.createDevice);
router.put('/:device_id', validateUpdateDevice, handleValidationErrors, deviceController.updateDevice);
router.delete('/:device_id', validateDeviceId, handleValidationErrors, deviceController.deleteDevice);

module.exports = router;

