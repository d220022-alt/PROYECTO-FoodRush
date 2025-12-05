const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('auditlogs', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    tenant_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'tenants',
        key: 'id'
      }
    },
    usuario_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    accion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    entidad: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    entidad_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    detalles: {
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
    tableName: 'auditlogs',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "auditlogs_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "idx_auditlogs_tenant",
        fields: [
          { name: "tenant_id" },
        ]
      },
    ]
  });
};
