const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Inventario extends Model {}

Inventario.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tenantId: DataTypes.INTEGER,
  sucursalId: DataTypes.INTEGER,
  productoId: DataTypes.INTEGER,
  cantidad: DataTypes.DECIMAL,
  stockMinimo: DataTypes.DECIMAL,
  actualizadoEn: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  tableName: 'Inventario',
  timestamps: false
});

module.exports = Inventario;
