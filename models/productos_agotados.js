const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('productos_agotados', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
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
    tenant_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'tenants',
        key: 'id'
      }
    },
    motivo: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'productos_agotados',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_productos_agotados_producto",
        fields: [
          { name: "producto_id" },
        ]
      },
      {
        name: "productos_agotados_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
