/*
  Guia rapida para presentar:
  Modelo Sequelize de Tenant Settings Extra. Define columnas, tipos y reglas de la tabla que usa el backend.
  Buscar en VS Code: modelo tenant_settings_extra, tabla tenant_settings_extra, columnas, tenant_id, Sequelize, relaciones.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tenant_settings_extra', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    tenant_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: "tenant_settings_extra_tenant_id_clave_key"
    },
    clave: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: "tenant_settings_extra_tenant_id_clave_key"
    },
    valor: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'tenant_settings_extra',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_tenant_settings_extra_tenant_clave",
        fields: [
          { name: "tenant_id" },
          { name: "clave" },
        ]
      },
      {
        name: "tenant_settings_extra_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "tenant_settings_extra_tenant_id_clave_key",
        unique: true,
        fields: [
          { name: "tenant_id" },
          { name: "clave" },
        ]
      },
    ]
  });
};
