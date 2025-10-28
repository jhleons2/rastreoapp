const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// const sequelize = require('./config/database'); // Comentado temporalmente

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

// HEALTH CHECK - Crítico para Railway
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    version: '1.0.0'
  });
});

// Ruta principal
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Tracking API - Taller 2 Redes MCIC',
    description: 'Sistema de rastreo geográfico',
    endpoints: {
      health: '/health',
      api: '/api'
    },
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Placeholder para futuras rutas
app.get('/api', (req, res) => {
  res.json({
    message: 'API endpoints',
    auth: '/api/auth',
    devices: '/api/devices',
    locations: '/api/locations'
  });
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
    
    // Iniciar servidor (sin conectar DB todavía)
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Servidor corriendo en puerto ${PORT}`);
      console.log(`🌐 URL: http://0.0.0.0:${PORT}`);
      console.log(`❤️  Health check: http://0.0.0.0:${PORT}/health`);
      
      // Intentar conectar a base de datos en background (comentado temporalmente)
      // sequelize.authenticate()
      //   .then(() => console.log('✅ Base de datos conectada correctamente'))
      //   .catch((err) => console.log('⚠️ Base de datos no conectada:', err.message));
    });
    
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error.message);
    process.exit(1);
  }
};

// Manejo graceful de señales
process.on('SIGTERM', async () => {
  console.log('⚠️ SIGTERM recibido, cerrando conexiones...');
  // await sequelize.close(); // Comentado temporalmente
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('⚠️ SIGINT recibido, cerrando conexiones...');
  // await sequelize.close(); // Comentado temporalmente
  process.exit(0);
});

startServer();

