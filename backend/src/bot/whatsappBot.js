/**
 * Bot de WhatsApp para solicitar ubicaciones
 * Usa whatsapp-web.js para conectar con WhatsApp
 */

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

class WhatsAppBotService {
  constructor() {
    this.client = null;
    this.ready = false;
    this.userSessions = new Map(); // { phone_number: { chatId, linked } }
  }

  /**
   * Inicializar el bot de WhatsApp
   */
  async init() {
    try {
      console.log('[WhatsApp Bot] Initializing...');
      
      this.client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      });

      // Generar QR para escanear
      this.client.on('qr', (qr) => {
        console.log('[WhatsApp Bot] QR Code generated. Scan with WhatsApp:');
        qrcode.generate(qr, { small: true });
        console.log('\n[WhatsApp Bot] Scan the QR code above with your WhatsApp mobile app\n');
      });

      // Conectado y listo
      this.client.on('ready', () => {
        console.log('[WhatsApp Bot] Client is ready!');
        this.ready = true;
      });

      // Error de autenticación
      this.client.on('auth_failure', (msg) => {
        console.error('[WhatsApp Bot] Authentication failed:', msg);
      });

      // Desconectado
      this.client.on('disconnected', (reason) => {
        console.log('[WhatsApp Bot] Client was disconnected:', reason);
        this.ready = false;
      });

      // Mensaje recibido
      this.client.on('message', async (msg) => {
        await this.handleMessage(msg);
      });

      // Ubicación recibida
      this.client.on('message_create', async (msg) => {
        if (msg.type === 'location') {
          await this.handleLocation(msg);
        }
      });

      // Inicializar
      await this.client.initialize();
    } catch (error) {
      console.error('[WhatsApp Bot] Error initializing:', error);
    }
  }

  /**
   * Manejar mensajes de texto
   */
  async handleMessage(msg) {
    const chat = await msg.getChat();
    const contact = await msg.getContact();
    const from = contact.number;
    const messageText = msg.body.toLowerCase().trim();

    console.log(`[WhatsApp Bot] Message from ${from}: ${messageText}`);

    // Comandos
    if (messageText.startsWith('!start') || messageText === 'start' || messageText === 'iniciar') {
      await msg.reply(
        '👋 *¡Hola! Bienvenido a Rastreo App*\n\n' +
        '📱 *Comandos disponibles:*\n' +
        '• *iniciar* - Mostrar este mensaje\n' +
        '• *vincular <numero>* - Vincular con número telefónico\n' +
        '• *ubicacion* - Solicitar envío de ubicación\n' +
        '• *ayuda* - Ver ayuda\n\n' +
        'Para enviar tu ubicación, usa el botón de ubicación en WhatsApp.'
      );
    } else if (messageText.startsWith('!vincular') || messageText.startsWith('vincular')) {
      const match = messageText.match(/vincular\s*(\+?\d+)/);
      if (match) {
        const phoneNumber = match[1];
        this.userSessions.set(from, { phoneNumber, linked: true, chatId: from });
        await msg.reply(
          `✅ *Vinculado exitosamente*\n\n` +
          `Número: ${phoneNumber}\n` +
          `Puedes enviar tu ubicación ahora.`
        );
      } else {
        await msg.reply('❌ Formato incorrecto. Usa: *vincular +573001234567*');
      }
    } else if (messageText.includes('ubicacion') || messageText.includes('ubicación')) {
      await msg.reply(
        '📍 *Envío de Ubicación*\n\n' +
        'Para enviar tu ubicación:\n' +
        '1. Toca el botón 📎 en WhatsApp\n' +
        '2. Selecciona "Ubicación"\n' +
        '3. Envía tu ubicación actual\n\n' +
        'Tu ubicación será registrada automáticamente.'
      );
    } else if (messageText.includes('ayuda') || messageText === 'help') {
      await msg.reply(
        '📱 *Rastreo App - Ayuda*\n\n' +
        'Este bot te permite enviar tu ubicación geográfica.\n\n' +
        '*Comandos:*\n' +
        '• *iniciar* - Iniciar bot\n' +
        '• *vincular <numero>* - Vincular número\n' +
        '• *ubicacion* - Solicitar ubicación\n' +
        '• *ayuda* - Esta ayuda\n\n' +
        '*Uso:*\n' +
        '1. Vincula tu número con: *vincular + Canales de comunicación*57XXXXXXXX*\n' +
        '2. Envía tu ubicación con el botón 📎\n' +
        '3. Tu ubicación será registrada automáticamente.'
      );
    }
  }

  /**
   * Manejar ubicación recibida
   */
  async handleLocation(msg) {
    try {
      const location = msg.location;
      const contact = await msg.getContact();
      const from = contact.number;
      const session = this.userSessions.get(from);

      if (!session || !session.linked) {
        await msg.reply(
          '⚠️ *No estás vinculado*\n\n' +
          'Primero debes vincular tu número con: *vincular +57XXXXXXXX*'
        );
        return;
      }

      // Guardar ubicación (aquí podrías enviarla al backend)
      const locationData = {
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: new Date(),
        phoneNumber: session.phoneNumber
      };

      console.log('[WhatsApp Bot] Location received:', locationData);

      // Obtener dirección mediante geocodificación inversa
      const address = await this.getAddress(location.latitude, location.longitude);

      await msg.reply(
        '✅ *Ubicación recibida*\n\n' +
        `📍 Lat: ${location.latitude}\n` +
        `📍 Lng: ${location.longitude}\n` +
        `🏠 ${address}\n` +
        `⏰ ${new Date().toLocaleString('es-ES')}\n\n` +
        'Tu ubicación ha sido registrada correctamente.'
      );
    } catch (error) {
      console.error('[WhatsApp Bot] Error handling location:', error);
      await msg.reply('❌ Error al procesar ubicación. Intenta de nuevo.');
    }
  }

  /**
   * Obtener dirección a partir de coordenadas
   */
  async getAddress(latitude, longitude) {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat: latitude,
          lon: longitude,
          format: 'json'
        },
        headers: {
          'User-Agent': 'RastreoApp'
        }
      });

      if (response.data && response.data.display_name) {
        return response.data.display_name;
      }
      return 'Dirección no disponible';
    } catch (error) {
      return 'Dirección no disponible';
    }
  }

  /**
   * Verificar si el bot está listo
   */
  isReady() {
    return this.ready;
  }

  /**
   * Enviar mensaje a un número
   */
  async sendMessage(phoneNumber, message) {
    if (!this.ready) {
      console.error('[WhatsApp Bot] Client is not ready');
      return false;
    }

    try {
      const number = phoneNumber.includes('@') ? phoneNumber : `${phoneNumber}@c.us`;
      await this.client.sendMessage(number, message);
      return true;
    } catch (error) {
      console.error('[WhatsApp Bot] Error sending message:', error);
      return false;
    }
  }

  /**
   * Solicitar ubicación a un usuario
   */
  async requestLocation(phoneNumber) {
    return await this.sendMessage(
      phoneNumber,
      '📍 Por favor, envía tu ubicación actual:\n\n' +
      '1. Toca el botón 📎\n' +
      '2. Selecciona "Ubicación"\n' +
      '3. Envía'
    );
  }
}

// Exportar instancia singleton
const whatsappBot = new WhatsAppBotService();

module.exports = whatsappBot;

