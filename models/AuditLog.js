const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class AuditLog extends Model {}

AuditLog.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tenantId: DataTypes.INTEGER,
  usuarioId: DataTypes.INTEGER,
  accion: DataTypes.STRING,
  entidad: DataTypes.STRING,
  entidadId: DataTypes.STRING,
  detalles: DataTypes.TEXT,
  creadoEn: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  tableName: 'AuditLogs',
  timestamps: false
});

module.exports = AuditLog;
