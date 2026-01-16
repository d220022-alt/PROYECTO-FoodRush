const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pagos', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    pedido_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    factura_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    metodo_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    monto: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    referencia: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'pagos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_pagos_pedido",
        fields: [
          { name: "pedido_id" },
        ]
      },
      {
        name: "pagos_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
