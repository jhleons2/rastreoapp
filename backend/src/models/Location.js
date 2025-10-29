module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  
  const Location = sequelize.define('Location', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  device_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  },
  accuracy: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  altitude: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true
  },
  speed: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  heading: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Dirección obtenida mediante geocodificación inversa'
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
    tableName: 'locations',
    timestamps: false
  });

  return Location;
};


