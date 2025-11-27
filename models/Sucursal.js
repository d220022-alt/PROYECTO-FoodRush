const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Sucursal extends Model {}

Sucursal.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tenantId: DataTypes.INTEGER,
  nombre: DataTypes.STRING,
  direccion: DataTypes.STRING,
  ciudad: DataTypes.STRING,
  telefono: DataTypes.STRING,
  activo: DataTypes.BOOLEAN,
  creadoEn: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  tableName: 'Sucursales',
  timestamps: false
});

module.exports = Sucursal;
