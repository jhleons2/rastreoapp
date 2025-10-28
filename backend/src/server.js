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
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    locations: '/api/locations'
  });
});

// Test route para debug
app.get('/test', (req, res) => {
  res.json({ message: 'Test route funciona' });
});

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
          // Sincronizar modelos si es necesario
          if (process.env.NODE_ENV === 'development') {
            sequelize.sync({ alter: false }).then(() => {
              console.log('✅ Modelos sincronizados');
            });
          }
        })
        .catch((err) => {
          console.log('⚠️ Base de datos no conectada:', err.message);
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

startServer();

