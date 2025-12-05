const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pagos_reembolsos', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    pago_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'pagos',
        key: 'id'
      }
    },
    tenant_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'tenants',
        key: 'id'
      }
    },
    monto: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "pendiente"
    },
    procesador_response: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'pagos_reembolsos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_pagos_reembolsos_pago",
        fields: [
          { name: "pago_id" },
        ]
      },
      {
        name: "pagos_reembolsos_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
