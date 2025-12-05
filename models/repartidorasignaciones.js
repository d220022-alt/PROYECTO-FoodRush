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
      allowNull: false,
      references: {
        model: 'pedidos',
        key: 'id'
      }
    },
    repartidor_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'repartidores',
        key: 'id'
      }
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
