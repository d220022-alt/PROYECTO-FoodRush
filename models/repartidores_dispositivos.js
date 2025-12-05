const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('repartidores_dispositivos', {
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
    tipo_dispositivo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    token_notificacion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    modelo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    so_version: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ip_ultima: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ultimo_acceso: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'repartidores_dispositivos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_repartidores_dispositivos_rep",
        fields: [
          { name: "repartidor_id" },
        ]
      },
      {
        name: "repartidores_dispositivos_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
