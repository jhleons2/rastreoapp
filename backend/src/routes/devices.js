const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const { authenticate } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/', deviceController.getDevices);
router.get('/:device_id', deviceController.getDevice);
router.post('/', deviceController.createDevice);
router.put('/:device_id', deviceController.updateDevice);
router.delete('/:device_id', deviceController.deleteDevice);

module.exports = router;

