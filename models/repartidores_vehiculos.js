const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('repartidores_vehiculos', {
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
    tipo_vehiculo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    placa: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    marca: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    modelo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'repartidores_vehiculos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_repartidores_vehiculos_rep",
        fields: [
          { name: "repartidor_id" },
        ]
      },
      {
        name: "repartidores_vehiculos_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
