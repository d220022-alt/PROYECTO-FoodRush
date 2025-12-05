const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sucursalmetodospago', {
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
    metodo_codigo: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'sucursalmetodospago',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "sucursalmetodospago_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
