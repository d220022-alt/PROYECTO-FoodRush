const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pedidoitemopciones', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    pedidoitem_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'pedidoitems',
        key: 'id'
      }
    },
    opcion_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'productosopciones',
        key: 'id'
      }
    },
    precio_adicional: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'pedidoitemopciones',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pedidoitemopciones_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
