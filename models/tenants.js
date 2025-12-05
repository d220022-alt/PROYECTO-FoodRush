const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tenants', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    codigo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    contacto: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'tenants',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_tenants_codigo",
        fields: [
          { name: "codigo" },
        ]
      },
      {
        name: "tenants_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
