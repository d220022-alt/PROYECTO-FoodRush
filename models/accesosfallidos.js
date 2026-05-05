/*
  Guia rapida para presentar:
  Modelo Sequelize de Accesosfallidos. Define columnas, tipos y reglas de la tabla que usa el backend.
  Buscar en VS Code: modelo accesosfallidos, tabla accesosfallidos, columnas, tenant_id, Sequelize, relaciones.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('accesosfallidos', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    usuario_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ip_origen: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    intento_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    detalle: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'accesosfallidos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "accesosfallidos_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
