/*
  Guia rapida para presentar:
  Modelo Sequelize de Productosopciones. Define columnas, tipos y reglas de la tabla que usa el backend.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('productosopciones', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    grupo_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    precio_adicional: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'productosopciones',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "productosopciones_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
