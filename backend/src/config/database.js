const Sequelize = require('sequelize');
require('dotenv').config();

// Railway automáticamente proporciona DATABASE_URL cuando agregas PostgreSQL
let databaseUrl = process.env.DATABASE_URL || 
  `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;

// Convertir postgresql:// a postgres:// si es necesario
databaseUrl = databaseUrl.replace('postgresql://', 'postgres://');

console.log('📊 Configurando conexión a base de datos...');

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: process.env.DATABASE_URL ? {
      require: true,
      rejectUnauthorized: false
    } : false
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
  }
});

module.exports = sequelize;

