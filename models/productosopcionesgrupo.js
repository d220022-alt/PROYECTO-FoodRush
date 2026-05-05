/*
  Guia rapida para presentar:
  Modelo Sequelize de Productosopcionesgrupo. Define columnas, tipos y reglas de la tabla que usa el backend.
  Buscar en VS Code: modelo productosopcionesgrupo, tabla productosopcionesgrupo, columnas, tenant_id, Sequelize, relaciones.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('productosopcionesgrupo', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    tenant_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    requerido: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'productosopcionesgrupo',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "productosopcionesgrupo_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
