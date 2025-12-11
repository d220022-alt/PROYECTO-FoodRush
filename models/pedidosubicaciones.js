module.exports = (sequelize, DataTypes) => {
  const pedidosubicaciones = sequelize.define("pedidosubicaciones", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    pedido_id: DataTypes.BIGINT,
    lat: DataTypes.DECIMAL,
    lon: DataTypes.DECIMAL,
    registrado_en: DataTypes.DATE
  }, {
    tableName: "pedidosubicaciones",
    timestamps: false
  });

  pedidosubicaciones.associate = (models) => {
    pedidosubicaciones.belongsTo(models.pedidos, {
      foreignKey: "pedido_id",
      as: "pedido"
    });
  };

  return pedidosubicaciones;
};
