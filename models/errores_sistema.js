const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('errores_sistema', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    tenant_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'tenants',
        key: 'id'
      }
    },
    modulo: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    endpoint: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    stack: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    nivel: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "ERROR"
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'errores_sistema',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "errores_sistema_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "idx_errores_sistema_tenant_modulo",
        fields: [
          { name: "tenant_id" },
          { name: "modulo" },
        ]
      },
    ]
  });
};
