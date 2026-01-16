const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pedidos_reembolsos', {
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
    pago_id: {
      type: DataTypes.BIGINT,
      allowNull: true
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
    motivo: {
      type: DataTypes.TEXT,
      allowNull: true
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
    tableName: 'pedidos_reembolsos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_pedidos_reembolsos_pedido",
        fields: [
          { name: "pedido_id" },
        ]
      },
      {
        name: "idx_pedidos_reembolsos_tenant",
        fields: [
          { name: "tenant_id" },
        ]
      },
      {
        name: "pedidos_reembolsos_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
