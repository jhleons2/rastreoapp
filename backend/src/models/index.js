const User = require('./User');
const Device = require('./Device');
const Location = require('./Location');

// Definir relaciones
User.hasMany(Device, { foreignKey: 'user_id', as: 'devices' });
Device.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Device.hasMany(Location, { foreignKey: 'device_id', as: 'locations' });
Location.belongsTo(Device, { foreignKey: 'device_id', as: 'device' });

module.exports = {
  User,
  Device,
  Location
};

