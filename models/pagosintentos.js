const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pagosintentos', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    pago_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    intento_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    respuesta: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    exitoso: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'pagosintentos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pagosintentos_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
