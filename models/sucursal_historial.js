/*
  Guia rapida para presentar:
  Modelo Sequelize de Sucursal Historial. Define columnas, tipos y reglas de la tabla que usa el backend.
  Buscar en VS Code: modelo sucursal_historial, tabla sucursal_historial, columnas, tenant_id, Sequelize, relaciones.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
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
      allowNull: false
    },
    tenant_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    cambio: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    cambiado_por: {
      type: DataTypes.BIGINT,
      allowNull: true
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
