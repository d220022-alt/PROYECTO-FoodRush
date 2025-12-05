const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sucursal_historial', {
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
    cambio: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    cambiado_por: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    detalles: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'sucursal_historial',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_sucursal_historial_sucursal",
        fields: [
          { name: "sucursal_id" },
        ]
      },
      {
        name: "sucursal_historial_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
