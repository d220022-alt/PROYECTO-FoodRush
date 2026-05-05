/*
  Guia rapida para presentar:
  Modelo Sequelize de Productosimpuestos. Define columnas, tipos y reglas de la tabla que usa el backend.
  Buscar en VS Code: modelo productosimpuestos, tabla productosimpuestos, columnas, tenant_id, Sequelize, relaciones.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('productosimpuestos', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    producto_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    impuesto_codigo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    porcentaje: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'productosimpuestos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "productosimpuestos_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
