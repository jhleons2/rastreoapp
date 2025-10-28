module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  
  const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  phone_number: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return User;
};


