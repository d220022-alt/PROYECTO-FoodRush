const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sucursaleszonascobertura', {
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
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    radio_metros: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    poligono_geo: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'sucursaleszonascobertura',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "sucursaleszonascobertura_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
