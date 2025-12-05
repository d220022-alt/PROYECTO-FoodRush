const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('productos_imagenes', {
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
    imagen_url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    orden: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'productos_imagenes',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_productos_imagenes_producto",
        fields: [
          { name: "producto_id" },
        ]
      },
      {
        name: "idx_productos_imagenes_tenant",
        fields: [
          { name: "tenant_id" },
        ]
      },
      {
        name: "productos_imagenes_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
