const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usuarios', {
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
      references: {
        model: 'tenants',
        key: 'id'
      },
      unique: "usuarios_tenant_id_correo_key"
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "usuarios_tenant_id_correo_key"
    },
    contrasena: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    rol_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'roles',
        key: 'id'
      }
    },
    telefono: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'usuarios',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "idx_usuarios_tenant_correo",
        fields: [
          { name: "tenant_id" },
          { name: "correo" },
        ]
      },
      {
        name: "usuarios_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "usuarios_tenant_id_correo_key",
        unique: true,
        fields: [
          { name: "tenant_id" },
          { name: "correo" },
        ]
      },
    ]
  });
};
