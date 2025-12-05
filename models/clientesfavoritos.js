const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('clientesfavoritos', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    cliente_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'clientes',
        key: 'id'
      }
    },
    sucursal_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'sucursales',
        key: 'id'
      }
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'clientesfavoritos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "clientesfavoritos_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
