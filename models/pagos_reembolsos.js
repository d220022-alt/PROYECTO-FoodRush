/*
  Guia rapida para presentar:
  Modelo Sequelize de Pagos Reembolsos. Define columnas, tipos y reglas de la tabla que usa el backend.
  Buscar en VS Code: modelo pagos_reembolsos, tabla pagos_reembolsos, columnas, tenant_id, Sequelize, relaciones.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
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
      allowNull: false
    },
    tenant_id: {
      type: DataTypes.BIGINT,
      allowNull: false
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
