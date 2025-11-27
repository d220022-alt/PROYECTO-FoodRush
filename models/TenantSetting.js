const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class TenantSetting extends Model {}

TenantSetting.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tenantId: DataTypes.INTEGER,
  clave: DataTypes.STRING,
  valor: DataTypes.STRING
}, {
  sequelize,
  tableName: 'TenantSettings',
  timestamps: false
});

module.exports = TenantSetting;
