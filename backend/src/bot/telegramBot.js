/**
 * Bot de Telegram para solicitar ubicaciones
 * Permite a los usuarios enviar ubicaciones manualmente
 */

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

class TelegramBotService {
  constructor() {
    this.bot = null;
    this.userSessions = new Map(); // Almacenar sesiones de usuarios
  }

  /**
   * Inicializar el bot
   */
  init(token) {
    if (!token) {
      console.log('[Telegram Bot] Token not provided, bot disabled');
      return;
    }

    try {
      this.bot = new TelegramBot(token, { polling: true });
      
      this.bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        this.bot.sendMessage(
          chatId,
          '¡Hola! 👋\n\nSoy el bot de Rastreo App.\n\n' +
          'Comandos disponibles:\n' +
          '/start - Mostrar este mensaje\n' +
          '/help - Ayuda\n' +
          '/location - Enviar ubicación actual\n' +
          '/link <phone> - Vincular con número telefónico\n' +
          '/status - Ver estado',
          { reply_markup: this.getMainMenu() }
        );
      });

      this.bot.onText(/\/help/, (msg) => {
        const chatId = msg.chat.id;
        this.bot.sendMessage(
          chatId,
          '📱 **Rastreo App - Ayuda**\n\n' +
          'Este bot te permite enviar tu ubicación manualmente.\n\n' +
          '**Comandos:**\n' +
          '/start - Iniciar bot\n' +
          '/location - Enviar ubicación\n' +
          '/link <phone> - Vincular con tu número\n' +
          '/status - Ver información',
          { parse_mode: 'Markdown' }
        );
      });

      this.bot.onText(/\/location/, (msg) => {
        const chatId = msg.chat.id;
        this.bot.sendMessage(
          chatId,
          '📍 Por favor, comparte tu ubicación:',
          {
            reply_markup: {
              keyboard: [[{ text: '📌 Compartir ubicación', request_location: true }]],
              resize_keyboard: true,
              one_time_keyboard: true
            }
          }
        );
      });

      this.bot.onText(/\/link (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const phoneNumber = match[1];
        
        // Guardar la vinculación (aquí podrías guardar en BD)
        this.userSessions.set(chatId, { phone_number: phoneNumber });
        
        this.bot.sendMessage(
          chatId,
          `✅ Vinculado con número: ${phoneNumber}\n\nAhora puedes enviar ubicaciones.`
        );
      });

      this.bot.onText(/\/status/, (msg) => {
        const chatId = msg.chat.id;
        const session = this.userSessions.get(chatId);
        
        if (session) {
          this.bot.sendMessage(
            chatId,
            `📱 **Estado:**\n\nNúmero vinculado: ${session.phone_number}\nChat ID: ${chatId}`
          );
        } else {
          this.bot.sendMessage(
            chatId,
            '⚠️ No hay información vinculada. Usa /link <phone> para vincular tu número.'
          );
        }
      });

      // Manejar ubicaciones enviadas
      this.bot.on('location', async (msg) => {
        const chatId = msg.chat.id;
        const location = msg.location;
        const session = this.userSessions.get(chatId);
        
        if (!session) {
          this.bot.sendMessage(
            chatId,
            '⚠️ Primero vincula tu número con /link <phone>'
          );
          return;
        }

        try {
          // Aquí guardarías la ubicación en Arxquitectura de AI-based tracking app
          // Por ahora solo confirmamos
          this.bot.sendMessage(
            chatId,
            `✅ Ubicación recibida:\n\nLatitud: ${location.latitude}\nLongitud: ${location.longitude}\n\n📅 ${new Date().toLocaleString()}`,
            { reply_markup: this.getMainMenu() }
          );
        } catch (error) {
          this.bot.sendMessage(
            chatId,
            '❌ Error al procesar ubicación. Intenta de nuevo.'
          );
        }
      });

      // Manejar mensajes de texto desconocidos
      this.bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        if (msg.text && !msg.text.startsWith('/')) {
          this.bot.sendMessage(
            chatId,
            'Lo siento, no entiendo ese comando. Usa /help para ver ayuda.'
          );
        }
      });

      console.log('[Telegram Bot] Bot initialized successfully');
    } catch (error) {
      console.error('[Telegram Bot] Error initializing:', error);
    }
  }

  /**
   * Menú principal
   */
  getMainMenu() {
    return {
      keyboard: [
        [{ text: '📍 Enviar ubicación' }],
        [{ text: '📊 Estado' }, { text: '❓ Ayuda' }]
      ],
      resize_keyboard: true
    };
  }

  /**
   * Enviar notificación a un usuario
   */
  async sendNotification(chatId, message) {
    if (!this.bot) return false;
    
    try {
      await this.bot.sendMessage(chatId, message);
      return true;
    } catch (error) {
      console.error('[Telegram Bot] Error sending notification:', error);
      return false;
    }
  }
}

// Exportar instancia singleton
const telegramBot = new TelegramBotService();

module.exports = telegramBot;

