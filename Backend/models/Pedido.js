const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Pedido extends Model {}

Pedido.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tenantId: DataTypes.INTEGER,
  sucursalId: DataTypes.INTEGER,
  clienteId: DataTypes.INTEGER,
  usuarioId: DataTypes.INTEGER,
  total: DataTypes.DECIMAL,
  estado: DataTypes.STRING,
  creadoEn: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  actualizadoEn: DataTypes.DATE
}, {
  sequelize,
  tableName: 'Pedidos',
  timestamps: false
});

module.exports = Pedido;
