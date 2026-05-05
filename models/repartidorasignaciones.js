/*
  Guia rapida para presentar:
  Modelo Sequelize de Repartidorasignaciones. Define columnas, tipos y reglas de la tabla que usa el backend.
  Buscar en VS Code: modelo repartidorasignaciones, tabla repartidorasignaciones, columnas, tenant_id, Sequelize, relaciones.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('repartidorasignaciones', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    pedido_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    repartidor_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    asignado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    estado: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'repartidorasignaciones',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "repartidorasignaciones_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
