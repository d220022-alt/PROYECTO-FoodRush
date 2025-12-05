const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sucursal_cierres_temporales', {
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
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    motivo: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'sucursal_cierres_temporales',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_sucursal_cierres_sucursal",
        fields: [
          { name: "sucursal_id" },
        ]
      },
      {
        name: "sucursal_cierres_temporales_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
