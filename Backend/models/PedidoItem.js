const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class PedidoItem extends Model {}

PedidoItem.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pedidoId: DataTypes.INTEGER,
  productoId: DataTypes.INTEGER,
  cantidad: DataTypes.DECIMAL,
  precioUnitario: DataTypes.DECIMAL,
  subtotal: DataTypes.DECIMAL
}, {
  sequelize,
  tableName: 'PedidoItems',
  timestamps: false
});

module.exports = PedidoItem;
