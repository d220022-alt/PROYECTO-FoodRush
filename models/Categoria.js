const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Categoria extends Model {}

Categoria.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tenantId: DataTypes.INTEGER,
  nombre: DataTypes.STRING,
  descripcion: DataTypes.STRING,
  creadoEn: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  tableName: 'Categorias',
  timestamps: false
});

module.exports = Categoria;
