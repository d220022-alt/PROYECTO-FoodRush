const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sucursal_config', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    sucursal_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'sucursales',
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
    tiempo_preparacion_promedio: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tiempo_entrega_promedio: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pedido_minimo: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    costo_envio_base: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    costo_envio_por_km: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    radio_maximo_entrega_km: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 10
    },
    acepta_efectivo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    acepta_tarjetas: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'sucursal_config',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_sucursal_config_sucursal",
        fields: [
          { name: "sucursal_id" },
        ]
      },
      {
        name: "sucursal_config_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
