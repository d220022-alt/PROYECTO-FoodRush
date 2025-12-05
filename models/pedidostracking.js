const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pedidostracking', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    pedido_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'pedidos',
        key: 'id'
      }
    },
    estado_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'estadospedidos',
        key: 'id'
      }
    },
    nota: {
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
    tableName: 'pedidostracking',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_pedidostracking_pedido",
        fields: [
          { name: "pedido_id" },
        ]
      },
      {
        name: "pedidostracking_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
