const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pedidoitems', {
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
    producto_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'productos',
        key: 'id'
      }
    },
    variante_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'productosvariantes',
        key: 'id'
      }
    },
    cantidad: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 1
    },
    precio_unitario: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    subtotal: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'pedidoitems',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_pedidoitems_pedido",
        fields: [
          { name: "pedido_id" },
        ]
      },
      {
        name: "pedidoitems_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
