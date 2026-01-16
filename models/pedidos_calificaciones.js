const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pedidos_calificaciones', {
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
    tenant_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    calificacion_cliente: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    comentario_cliente: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    calificacion_repartidor: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    calificacion_sucursal: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'pedidos_calificaciones',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_pedidos_calificaciones_pedido",
        fields: [
          { name: "pedido_id" },
        ]
      },
      {
        name: "idx_pedidos_calificaciones_tenant",
        fields: [
          { name: "tenant_id" },
        ]
      },
      {
        name: "pedidos_calificaciones_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
