const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('repartidores_documentos', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    repartidor_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'repartidores',
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
    tipo_doc: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    numero: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    url_documento: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    valido: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    fecha_emision: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    fecha_vencimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'repartidores_documentos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_repartidores_documentos_rep",
        fields: [
          { name: "repartidor_id" },
        ]
      },
      {
        name: "idx_repartidores_documentos_tenant",
        fields: [
          { name: "tenant_id" },
        ]
      },
      {
        name: "repartidores_documentos_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
