const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tenantsettings', {
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
      unique: "tenantsettings_tenant_id_clave_key"
    },
    clave: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: "tenantsettings_tenant_id_clave_key"
    },
    valor: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tenantsettings',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_tenantsettings_tenant_clave",
        fields: [
          { name: "tenant_id" },
          { name: "clave" },
        ]
      },
      {
        name: "idx_tenantsettings_valor",
        fields: [
          { name: "valor" },
        ]
      },
      {
        name: "tenantsettings_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "tenantsettings_tenant_id_clave_key",
        unique: true,
        fields: [
          { name: "tenant_id" },
          { name: "clave" },
        ]
      },
    ]
  });
};
