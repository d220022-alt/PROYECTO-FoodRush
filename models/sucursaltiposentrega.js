/*
  Guia rapida para presentar:
  Modelo Sequelize de Sucursaltiposentrega. Define columnas, tipos y reglas de la tabla que usa el backend.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sucursaltiposentrega', {
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
    tipo: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'sucursaltiposentrega',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "sucursaltiposentrega_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
