const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const sequelize = require('./config/database');
const { User, Device, Location } = require('./models');

const app = express();

// Railway asigna el puerto automáticamente
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: [
    'https://rastreoapp-frontend-production.up.railway.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sanitización global de entrada
const { sanitizeInput } = require('./middleware/validation');
app.use(sanitizeInput);

// Debug middleware
app.use((req, res, next) => {
  console.log(`📥 Request: ${req.method} ${req.path}`);
  next();
});

// HEALTH CHECK - Crítico para Railway
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ 
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      version: '1.0.0'
    });
  } catch (error) {
    res.json({ 
      status: 'ok',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      version: '1.0.0'
    });
  }
});

// Ruta principal
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body style="background: black; color: white; padding: 50px; font-family: monospace;">
        <h1>🚀 Tracking API - Taller 2 Redes MCIC</h1>
        <p>Sistema de rastreo geográfico</p>
        <h2>Endpoints:</h2>
        <ul>
          <li><a href="/health" style="color: cyan;">/health</a> - Health check</li>
          <li><a href="/api" style="color: cyan;">/api</a> - API info</li>
        </ul>
        <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'production'}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      </body>
    </html>
  `);
});

// Placeholder para futuras rutas
app.get('/api', (req, res) => {
  console.log('📡 Ruta /api accedida');
  res.json({
    message: 'API endpoints',
    auth: '/api/auth',
    devices: '/api/devices',
    locations: '/api/locations',
    stats: '/api/stats',
    geofences: '/api/geofences',
    bots: '/api/bots',
    share: '/api/share'
  });
});

// Test route para debug
app.get('/test', (req, res) => {
  res.json({ message: 'Test route funciona' });
});

// Debug: verificar variables de entorno
app.get('/debug', (req, res) => {
  res.json({
    database_url_set: !!process.env.DATABASE_URL,
    database_url_length: process.env.DATABASE_URL?.length || 0,
    node_env: process.env.NODE_ENV,
    has_pg_vars: {
      PGHOST: !!process.env.PGHOST,
      PGPORT: !!process.env.PGPORT,
      PGUSER: !!process.env.PGUSER,
      PGDATABASE: !!process.env.PGDATABASE
    }
  });
});

// Importar y usar rutas de la API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/devices', require('./routes/devices'));
app.use('/api/locations', require('./routes/locations'));
app.use('/api/geofences', require('./routes/geofences'));
app.use('/api/bots', require('./routes/botRoutes'));
app.use('/api/share', require('./routes/shareLocation'));
app.use('/api/stats', require('./routes/stats'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
const startServer = async () => {
  try {
    console.log('🚀 Iniciando servidor...');
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'production'}`);
    
    // Iniciar servidor
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Servidor corriendo en puerto ${PORT}`);
      console.log(`🌐 URL: http://0.0.0.0:${PORT}`);
      console.log(`❤️  Health check: http://0.0.0.0:${PORT}/health`);
      
      // Intentar conectar a base de datos en background
      sequelize.authenticate()
        .then(() => {
          console.log('✅ Base de datos conectada correctamente');
          console.log('📊 URL de conexión:', process.env.DATABASE_URL ? 'Configurada' : 'No configurada');
          // Sincronizar modelos
          sequelize.sync({ alter: false })
            .then(() => {
              console.log('✅ Modelos sincronizados (User, Device, Location)');
            })
            .catch(err => {
              console.log('⚠️ Error sincronizando modelos:', err.message);
            });
        })
        .catch((err) => {
          console.log('⚠️ Base de datos no conectada');
          console.log('❌ Error:', err.message);
          console.log('📋 Variables disponibles:');
          console.log('   DATABASE_URL:', process.env.DATABASE_URL ? 'Sí' : 'No');
          console.log('   PGHOST:', process.env.PGHOST || 'No');
          console.log('   PGPORT:', process.env.PGPORT || 'No');
          console.log('   PGUSER:', process.env.PGUSER || 'No');
          console.log('   PGPASSWORD:', process.env.PGPASSWORD ? 'Sí' : 'No');
          console.log('   PGDATABASE:', process.env.PGDATABASE || 'No');
        });
    });
    
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error.message);
    process.exit(1);
  }
};

// Manejo graceful de señales
process.on('SIGTERM', async () => {
  console.log('⚠️ SIGTERM recibido, cerrando conexiones...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('⚠️ SIGINT recibido, cerrando conexiones...');
  await sequelize.close();
  process.exit(0);
});

// Inicializar bots (opcional)
async function initializeBots() {
  // Bot de Telegram
  if (process.env.TELEGRAM_BOT_TOKEN) {
    console.log('🤖 Initializing Telegram bot...');
    const telegramBot = require('./bot/telegramBot');
    telegramBot.init(process.env.TELEGRAM_BOT_TOKEN);
  } else {
    console.log('⚠️ TELEGRAM_BOT_TOKEN not set, skipping Telegram bot');
  }

  // Bot de WhatsApp
  if (process.env.ENABLE_WHATSAPP_BOT === 'true') {
    console.log('💬 Initializing WhatsApp bot...');
    const whatsappBot = require('./bot/whatsappBot');
    whatsappBot.init();
  } else {
    console.log('⚠️ WhatsApp bot disabled (set ENABLE_WHATSAPP_BOT=true to enable)');
  }
}

// Inicializar bots antes de iniciar servidor
initializeBots();

startServer();

