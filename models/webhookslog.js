/*
  Guia rapida para presentar:
  Modelo Sequelize de Webhookslog. Define columnas, tipos y reglas de la tabla que usa el backend.
  Buscar en VS Code: modelo webhookslog, tabla webhookslog, columnas, tenant_id, Sequelize, relaciones.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('webhookslog', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    endpoint: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    payload: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    respuesta: {
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
    tableName: 'webhookslog',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "webhookslog_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
