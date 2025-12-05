const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('categorias', {
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
      unique: "categorias_tenant_id_nombre_key"
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "categorias_tenant_id_nombre_key"
    },
    descripcion: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'categorias',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "categorias_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "categorias_tenant_id_nombre_key",
        unique: true,
        fields: [
          { name: "tenant_id" },
          { name: "nombre" },
        ]
      },
      {
        name: "idx_categorias_tenant",
        fields: [
          { name: "tenant_id" },
        ]
      },
    ]
  });
};
