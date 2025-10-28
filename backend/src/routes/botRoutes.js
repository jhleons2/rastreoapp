const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// Endpoints para interactuar con bots
// Estas rutas requieren autenticación del admin/usuario

router.post('/whatsapp/request-location', authenticate, async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;
    const whatsappBot = require('../bot/whatsappBot');

    if (!whatsappBot.isReady()) {
      return res.status(503).json({ error: 'WhatsApp bot no está conectado' });
    }

    const customMessage = message || 'Por favor, comparte tu ubicación actual.';
    const success = await whatsappBot.requestLocation(phoneNumber, customMessage);

    if (success) {
      res.json({ message: 'Solicitud de ubicación enviada' });
    } else {
      res.status(500).json({ error: 'Error al enviar solicitud' });
    }
  } catch (error) {
    console.error('Error requesting location via WhatsApp:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/telegram/request-location', authenticate, async (req, res) => {
  try {
    const { chatId, message } = req.body;
    const telegramBot = require('../bot/telegramBot');

    if (!telegramBot.isReady()) {
      return res.status(503).json({ error: 'Telegram bot no está configurado' });
    }

    const customMessage = message || 'Por favor, comparte tu ubicación actual.';
    const success = await telegramBot.requestLocation(chatId, customMessage);

    if (success) {
      res.json({ message: 'Solicitud de ubicación enviada' });
    } else {
      res.status(500).json({ error: 'Error al enviar solicitud' });
    }
  } catch (error) {
    console.error('Error requesting location via Telegram:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/status', authenticate, (req, res) => {
  const whatsappBot = require('../bot/whatsappBot');
  const telegramBot = require('../bot/telegramBot');

  res.json({
    whatsapp: {
      ready: whatsappBot.isReady(),
      enabled: process.env.ENABLE_WHATSAPP_BOT === 'true'
    },
    telegram: {
      ready: telegramBot.isReady(),
      enabled: !!process.env.TELEGRAM_BOT_TOKEN
    }
  });
});

module.exports = router;

