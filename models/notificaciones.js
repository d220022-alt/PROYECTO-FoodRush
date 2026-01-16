const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notificaciones', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    tenant_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    tipo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    destino: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    payload: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    enviado: {
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
    tableName: 'notificaciones',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_notificaciones_tenant",
        fields: [
          { name: "tenant_id" },
        ]
      },
      {
        name: "notificaciones_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
