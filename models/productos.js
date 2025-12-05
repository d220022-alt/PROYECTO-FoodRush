const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('productos', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    tenant_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'tenants',
        key: 'id'
      },
      unique: "productos_tenant_id_sku_key"
    },
    categoria_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'categorias',
        key: 'id'
      }
    },
    sku: {
      type: DataTypes.STRING(150),
      allowNull: true,
      unique: "productos_tenant_id_sku_key"
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    precio: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'productos',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "idx_productos_nombre_trgm",
        fields: [
          { name: "nombre" },
        ]
      },
      {
        name: "idx_productos_sku_tenant",
        fields: [
          { name: "tenant_id" },
          { name: "sku" },
        ]
      },
      {
        name: "idx_productos_tenant",
        fields: [
          { name: "tenant_id" },
        ]
      },
      {
        name: "idx_productos_tenant_activos",
        fields: [
          { name: "tenant_id" },
          { name: "id" },
        ]
      },
      {
        name: "productos_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "productos_tenant_id_sku_key",
        unique: true,
        fields: [
          { name: "tenant_id" },
          { name: "sku" },
        ]
      },
    ]
  });
};
