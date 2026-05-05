/*
  Guia rapida para presentar:
  Modelo Sequelize de Pedidoitemopciones. Define columnas, tipos y reglas de la tabla que usa el backend.
  Buscar en VS Code: modelo pedidoitemopciones, tabla pedidoitemopciones, columnas, tenant_id, Sequelize, relaciones.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
module.exports = (sequelize, DataTypes) => {
  const pedidoitemopciones = sequelize.define(
    "pedidoitemopciones",
    {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      pedidoitem_id: DataTypes.BIGINT,
      opcion_id: DataTypes.BIGINT,
      precio_adicional: DataTypes.DECIMAL
    },
    {
      freezeTableName: true,
      timestamps: false
    }
  );

  pedidoitemopciones.associate = (models) => {
    // Relación con pedidoitems
    pedidoitemopciones.belongsTo(models.pedidoitems, {
      foreignKey: "pedidoitem_id",
      as: "pedido_item"
    });

    // Relación con productosopciones
    pedidoitemopciones.belongsTo(models.productosopciones, {
      foreignKey: "opcion_id",
      as: "opcion"
    });
  };

  return pedidoitemopciones;
};

