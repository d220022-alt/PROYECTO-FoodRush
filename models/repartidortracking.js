const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('repartidortracking', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    repartidor_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    lon: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    registrado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'repartidortracking',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "repartidortracking_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
