/*
  Guia rapida para presentar:
  Modelo Sequelize de Pedidoitems. Define columnas, tipos y reglas de la tabla que usa el backend.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
module.exports = (sequelize, DataTypes) => {
  const pedidoitems = sequelize.define("pedidoitems", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    pedido_id: DataTypes.BIGINT,
    producto_id: DataTypes.BIGINT,
    variante_id: DataTypes.BIGINT,
    cantidad: DataTypes.DECIMAL,
    precio_unitario: DataTypes.DECIMAL,
    subtotal: DataTypes.DECIMAL
  }, {
    tableName: "pedidoitems",
    timestamps: false
  });

  pedidoitems.associate = (models) => {
    pedidoitems.belongsTo(models.pedidos, {
      foreignKey: "pedido_id",
      as: "pedido"
    });

    pedidoitems.belongsTo(models.productosvariantes, {
      foreignKey: "variante_id",
      as: "variante"
    });

    pedidoitems.belongsTo(models.productos, {
      foreignKey: "producto_id",
      as: "producto"
    });

    pedidoitems.hasMany(models.pedidoitemopciones, {
      foreignKey: "pedidoitem_id",
      as: "opciones"
    });
  };

  return pedidoitems;
};
