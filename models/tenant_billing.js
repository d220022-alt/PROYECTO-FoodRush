const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tenant_billing', {
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
      unique: "tenant_billing_tenant_id_periodo_mes_periodo_anio_key"
    },
    plan_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    periodo_mes: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      unique: "tenant_billing_tenant_id_periodo_mes_periodo_anio_key"
    },
    periodo_anio: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      unique: "tenant_billing_tenant_id_periodo_mes_periodo_anio_key"
    },
    monto: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "pendiente"
    },
    metodo_pago: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    recibo_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'tenant_billing',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_tenant_billing_tenant_periodo",
        fields: [
          { name: "tenant_id" },
          { name: "periodo_anio" },
          { name: "periodo_mes" },
        ]
      },
      {
        name: "tenant_billing_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "tenant_billing_tenant_id_periodo_mes_periodo_anio_key",
        unique: true,
        fields: [
          { name: "tenant_id" },
          { name: "periodo_mes" },
          { name: "periodo_anio" },
        ]
      },
    ]
  });
};
