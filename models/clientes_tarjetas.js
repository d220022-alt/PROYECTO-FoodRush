const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('clientes_tarjetas', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    cliente_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    tenant_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    proveedor: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ultimos_4: {
      type: DataTypes.CHAR(4),
      allowNull: true
    },
    moneda: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    vencimiento_month: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    vencimiento_year: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    predeterminada: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'clientes_tarjetas',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "clientes_tarjetas_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "idx_clientes_tarjetas_cliente",
        fields: [
          { name: "cliente_id" },
        ]
      },
      {
        name: "idx_clientes_tarjetas_tenant",
        fields: [
          { name: "tenant_id" },
        ]
      },
    ]
  });
};
