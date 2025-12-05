const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('estadospedidos', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    codigo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "estadospedidos_codigo_key"
    },
    descripcion: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'estadospedidos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "estadospedidos_codigo_key",
        unique: true,
        fields: [
          { name: "codigo" },
        ]
      },
      {
        name: "estadospedidos_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
