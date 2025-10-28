const Sequelize = require('sequelize');
require('dotenv').config();

// Railway automáticamente proporciona DATABASE_URL cuando agregas PostgreSQL
let databaseUrl = process.env.DATABASE_URL || 
  `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;

// Convertir postgresql:// a postgres:// si es necesario
databaseUrl = databaseUrl.replace('postgresql://', 'postgres://');

console.log('📊 Configurando conexión a base de datos...');
console.log('🔗 URL:', databaseUrl.replace(/:[^:@]+@/, ':****@')); // Ocultar password

// Configuración de Sequelize con manejo de errores
const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: false, // Deshabilitar SSL para Railway internal
    connectTimeout: 30000
  },
  logging: (msg) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(msg);
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  retry: {
    max: 3
  }
});

module.exports = sequelize;

