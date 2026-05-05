/*
  Guia rapida para presentar:
  Modelo Sequelize de Sucursaleszonascobertura. Define columnas, tipos y reglas de la tabla que usa el backend.
  Buscar en VS Code: modelo sucursaleszonascobertura, tabla sucursaleszonascobertura, columnas, tenant_id, Sequelize, relaciones.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sucursaleszonascobertura', {
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
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    radio_metros: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    poligono_geo: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'sucursaleszonascobertura',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "sucursaleszonascobertura_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
