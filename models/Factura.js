const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Factura extends Model {}

Factura.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tenantId: DataTypes.INTEGER,
  pedidoId: DataTypes.INTEGER,
  numeroFactura: DataTypes.STRING,
  subtotal: DataTypes.DECIMAL,
  impuestos: DataTypes.DECIMAL,
  total: DataTypes.DECIMAL,
  creadoEn: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  tableName: 'Facturas',
  timestamps: false
});

module.exports = Factura;
