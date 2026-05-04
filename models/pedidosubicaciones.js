/*
  Guia rapida para presentar:
  Modelo Sequelize de Pedidosubicaciones. Define columnas, tipos y reglas de la tabla que usa el backend.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
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
