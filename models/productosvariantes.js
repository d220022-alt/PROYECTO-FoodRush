const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('productosvariantes', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    producto_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'productos',
        key: 'id'
      }
    },
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    precio_adicional: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'productosvariantes',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "productosvariantes_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
