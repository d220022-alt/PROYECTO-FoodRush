const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('promociones_aplicaciones', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    promocion_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'promociones',
        key: 'id'
      }
    },
    pedido_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'pedidos',
        key: 'id'
      }
    },
    cliente_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'clientes',
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
    descuento: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'promociones_aplicaciones',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_promociones_aplicaciones_pedido",
        fields: [
          { name: "pedido_id" },
        ]
      },
      {
        name: "idx_promociones_aplicaciones_promo",
        fields: [
          { name: "promocion_id" },
        ]
      },
      {
        name: "promociones_aplicaciones_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
