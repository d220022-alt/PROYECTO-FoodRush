module.exports = (sequelize, DataTypes) => {
  const pedidos = sequelize.define("pedidos", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    tenant_id: DataTypes.BIGINT,
    sucursal_id: DataTypes.BIGINT,
    cliente_id: DataTypes.BIGINT,
    usuario_id: DataTypes.BIGINT,
    total: DataTypes.DECIMAL,
    estado_id: DataTypes.BIGINT,
    direccion_entrega_id: DataTypes.BIGINT,
    direccion_entrega: DataTypes.STRING,
    tipo_entrega: DataTypes.STRING,
    notas: DataTypes.TEXT,
    creado_en: DataTypes.DATE,
    actualizado_en: DataTypes.DATE
  }, {
    tableName: "pedidos",
    timestamps: false
  });

  pedidos.associate = (models) => {
    pedidos.hasMany(models.pedidoitems, {
      foreignKey: "pedido_id",
      as: "items"
    });

    pedidos.hasMany(models.pedidostracking, {
      foreignKey: "pedido_id",
      as: "tracking"
    });

    pedidos.hasMany(models.pedidosubicaciones, {
      foreignKey: "pedido_id",
      as: "ubicaciones"
    });
  };

  return pedidos;
};
