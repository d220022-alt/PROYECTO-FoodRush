const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Rol extends Model {}

Rol.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tenantId: DataTypes.INTEGER,
  nombre: DataTypes.STRING,
  permisos: DataTypes.STRING,
  creadoEn: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  tableName: 'Roles',
  timestamps: false
});

module.exports = Rol;
