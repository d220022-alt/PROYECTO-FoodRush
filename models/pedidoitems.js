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

    pedidoitems.hasMany(models.pedidoitemopciones, {
      foreignKey: "pedidoitem_id",
      as: "opciones"
    });
  };

  return pedidoitems;
};
