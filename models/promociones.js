const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('promociones', {
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
      unique: "promociones_tenant_id_codigo_key"
    },
    codigo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "promociones_tenant_id_codigo_key"
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tipo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    valor: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    max_uso_global: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max_uso_por_cliente: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: false
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
    tableName: 'promociones',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_promociones_tenant",
        fields: [
          { name: "tenant_id" },
        ]
      },
      {
        name: "promociones_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "promociones_tenant_id_codigo_key",
        unique: true,
        fields: [
          { name: "tenant_id" },
          { name: "codigo" },
        ]
      },
    ]
  });
};
