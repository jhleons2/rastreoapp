const sequelize = require('../config/database');

// Importar modelos
const User = require('./User')(sequelize);
const Device = require('./Device')(sequelize);
const Location = require('./Location')(sequelize);
const Geofence = require('./Geofence')(sequelize);

// Definir relaciones
User.hasMany(Device, { foreignKey: 'user_id', as: 'devices' });
Device.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Device.hasMany(Location, { foreignKey: 'device_id', as: 'locations' });
Location.belongsTo(Device, { foreignKey: 'device_id', as: 'device' });

User.hasMany(Geofence, { foreignKey: 'user_id', as: 'geofences' });
Geofence.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Device.hasMany(Geofence, { foreignKey: 'device_id', as: 'geofences' });
Geofence.belongsTo(Device, { foreignKey: 'device_id', as: 'device' });

module.exports = {
  User,
  Device,
  Location,
  Geofence
};


