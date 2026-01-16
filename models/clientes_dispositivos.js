const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('clientes_dispositivos', {
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
    tableName: 'clientes_dispositivos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "clientes_dispositivos_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "idx_clientes_dispositivos_cliente",
        fields: [
          { name: "cliente_id" },
        ]
      },
    ]
  });
};
