const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('permisos', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    tenant_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: "permisos_tenant_id_clave_key"
    },
    clave: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: "permisos_tenant_id_clave_key"
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'permisos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "permisos_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "permisos_tenant_id_clave_key",
        unique: true,
        fields: [
          { name: "tenant_id" },
          { name: "clave" },
        ]
      },
    ]
  });
};
