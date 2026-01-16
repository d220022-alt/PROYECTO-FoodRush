const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('clientes_historial', {
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
    cambio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ip_origen: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    dispositivo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'clientes_historial',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "clientes_historial_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "idx_clientes_historial_cliente",
        fields: [
          { name: "cliente_id" },
        ]
      },
    ]
  });
};
