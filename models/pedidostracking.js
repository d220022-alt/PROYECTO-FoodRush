module.exports = (sequelize, DataTypes) => {
  const pedidostracking = sequelize.define("pedidostracking", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    pedido_id: DataTypes.BIGINT,
    estado_id: DataTypes.BIGINT,
    nota: DataTypes.TEXT,
    creado_en: DataTypes.DATE
  }, {
    tableName: "pedidostracking",
    timestamps: false
  });

  pedidostracking.associate = (models) => {
    pedidostracking.belongsTo(models.pedidos, {
      foreignKey: "pedido_id",
      as: "pedido"
    });
  };

  return pedidostracking;
};


