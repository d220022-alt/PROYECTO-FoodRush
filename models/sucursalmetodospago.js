/*
  Guia rapida para presentar:
  Modelo Sequelize de Sucursalmetodospago. Define columnas, tipos y reglas de la tabla que usa el backend.
  Buscar en VS Code: modelo sucursalmetodospago, tabla sucursalmetodospago, columnas, tenant_id, Sequelize, relaciones.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sucursalmetodospago', {
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
    metodo_codigo: {
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
    tableName: 'sucursalmetodospago',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "sucursalmetodospago_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
