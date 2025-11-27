const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Usuario extends Model {}

Usuario.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tenantId: DataTypes.INTEGER,
  nombre: DataTypes.STRING,
  correo: DataTypes.STRING,
  contrasena: DataTypes.STRING,
  rolId: DataTypes.INTEGER,
  telefono: DataTypes.STRING,
  activo: { type: DataTypes.BOOLEAN, defaultValue: true },
  creadoEn: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  tableName: 'Usuarios',
  timestamps: false
});

module.exports = Usuario;

