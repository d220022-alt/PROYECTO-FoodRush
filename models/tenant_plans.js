const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tenant_plans', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    max_sucursales: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
    max_usuarios: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 5
    },
    max_productos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 500
    },
    costo_mensual: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
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
    tableName: 'tenant_plans',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "tenant_plans_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
