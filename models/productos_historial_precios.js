const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('productos_historial_precios', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    producto_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'productos',
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
    precio_anterior: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    precio_nuevo: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    cambiado_por: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    cambiado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'productos_historial_precios',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_productos_historial_producto",
        fields: [
          { name: "producto_id" },
        ]
      },
      {
        name: "idx_productos_historial_tenant",
        fields: [
          { name: "tenant_id" },
        ]
      },
      {
        name: "productos_historial_precios_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
