/*
  Guia rapida para presentar:
  Modelo Sequelize de Pedidostracking. Define columnas, tipos y reglas de la tabla que usa el backend.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
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


