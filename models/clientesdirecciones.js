const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('clientesdirecciones', {
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
    alias: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    direccion: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    lon: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'clientesdirecciones',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "clientesdirecciones_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
