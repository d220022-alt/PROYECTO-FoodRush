const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('clientes', {
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
      references: {
        model: 'tenants',
        key: 'id'
      },
      unique: "clientes_tenant_id_telefono_correo_key"
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: "clientes_tenant_id_telefono_correo_key"
    },
    correo: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "clientes_tenant_id_telefono_correo_key"
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'clientes',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "clientes_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "clientes_tenant_id_telefono_correo_key",
        unique: true,
        fields: [
          { name: "tenant_id" },
          { name: "telefono" },
          { name: "correo" },
        ]
      },
      {
        name: "idx_clientes_telefono_tenant",
        fields: [
          { name: "tenant_id" },
          { name: "telefono" },
        ]
      },
      {
        name: "idx_clientes_tenant",
        fields: [
          { name: "tenant_id" },
        ]
      },
    ]
  });
};
