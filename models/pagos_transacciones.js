const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pagos_transacciones', {
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
    referencia_procesador: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    autorizacion: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    tarjeta_mascara: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    banco_emisor: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    monto: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    moneda: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    respuesta_procesador: {
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
    tableName: 'pagos_transacciones',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_pagos_transacciones_pago",
        fields: [
          { name: "pago_id" },
        ]
      },
      {
        name: "idx_pagos_transacciones_tenant",
        fields: [
          { name: "tenant_id" },
        ]
      },
      {
        name: "pagos_transacciones_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
