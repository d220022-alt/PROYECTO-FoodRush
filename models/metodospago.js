/*
  Guia rapida para presentar:
  Modelo Sequelize de Metodospago. Define columnas, tipos y reglas de la tabla que usa el backend.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('metodospago', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    codigo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "metodospago_codigo_key"
    },
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'metodospago',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "metodospago_codigo_key",
        unique: true,
        fields: [
          { name: "codigo" },
        ]
      },
      {
        name: "metodospago_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
