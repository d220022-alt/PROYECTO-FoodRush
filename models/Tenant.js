const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Tenant extends Model {}

Tenant.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: DataTypes.STRING,
  codigo: DataTypes.STRING,
  contacto: DataTypes.STRING,
  creadoEn: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  sequelize,
  tableName: 'Tenants',
  timestamps: false
});

module.exports = Tenant;
