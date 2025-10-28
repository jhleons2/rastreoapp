const { Sequelize } = require('sequelize');
require('dotenv').config();

// Railway proporciona variables de PostgreSQL
const buildConnectionString = () => {
  // Intentar usar DATABASE_PUBLIC_URL primero (URL pública)
  if (process.env.DATABASE_PUBLIC_URL) {
    let url = process.env.DATABASE_PUBLIC_URL;
    if (url.startsWith('postgresql://')) {
      url = url.replace('postgresql://', 'postgres://');
    }
    return url;
  }
  
  // Si no existe, intentar con DATABASE_URL pero verificar el host
  if (process.env.DATABASE_URL) {
    let url = process.env.DATABASE_URL;
    
    // Si usa .railway.internal, intentar cambiarlo
    if (url.includes('.railway.internal')) {
      console.log('⚠️ URL usa .railway.internal, intentando cambiar...');
      // Necesitamos usar DATABASE_PUBLIC_URL en su lugar
      // Por ahora, retornar null para que intente con variables individuales
      return null;
    }
    
    if (url.startsWith('postgresql://')) {
      url = url.replace('postgresql://', 'postgres://');
    }
    return url;
  }
  
  // Construir desde variables individuales
  const host = process.env.PGHOST;
  const port = process.env.PGPORT;
  const user = process.env.PGUSER;
  const password = process.env.PGPASSWORD;
  const database = process.env.PGDATABASE;

  if (host && port && user && password && database) {
    return `postgres://${user}:${password}@${host}:${port}/${database}`;
  }
  
  return null;
};

const databaseUrl = buildConnectionString();

console.log('📊 Configurando conexión a base de datos...');
if (databaseUrl) {
  console.log('🔗 URL:', databaseUrl.replace(/:[^:@]+@/, ':****@')); // Ocultar password
  console.log('🔗 Host:', process.env.PGHOST || 'N/A');
} else {
  console.log('⚠️ No hay variables de base de datos configuradas');
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

