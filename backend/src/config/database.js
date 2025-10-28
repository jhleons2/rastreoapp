const { Sequelize } = require('sequelize');
require('dotenv').config();

// Railway automáticamente proporciona DATABASE_URL cuando agregas PostgreSQL
let databaseUrl = process.env.DATABASE_URL || 
  `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;

// Convertir postgresql:// a postgres:// si es necesario
if (databaseUrl && databaseUrl.startsWith('postgresql://')) {
  databaseUrl = databaseUrl.replace('postgresql://', 'postgres://');
}

console.log('📊 Configurando conexión a base de datos...');
if (databaseUrl) {
  console.log('🔗 URL:', databaseUrl.replace(/:[^:@]+@/, ':****@')); // Ocultar password
} else {
  console.log('⚠️ DATABASE_URL no configurada');
}

// Configuración de Sequelize con manejo de errores
const sequelize = new Sequelize(databaseUrl || 'postgres://localhost/temp', {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: false
  },
  logging: false,
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

