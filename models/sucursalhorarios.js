const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sucursalhorarios', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    sucursal_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'sucursales',
        key: 'id'
      }
    },
    dia: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    apertura: {
      type: DataTypes.TIME,
      allowNull: true
    },
    cierre: {
      type: DataTypes.TIME,
      allowNull: true
    },
    descripcion: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'sucursalhorarios',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "sucursalhorarios_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
