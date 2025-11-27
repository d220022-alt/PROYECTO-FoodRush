const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Pago extends Model {}

Pago.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  facturaId: DataTypes.INTEGER,
  metodo: DataTypes.STRING,
  monto: DataTypes.DECIMAL,
  referencia: DataTypes.STRING,
  estado: DataTypes.STRING,
  creadoEn: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  tableName: 'Pagos',
  timestamps: false
});

module.exports = Pago;
