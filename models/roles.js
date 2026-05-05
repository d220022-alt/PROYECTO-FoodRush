/*
  Guia rapida para presentar:
  Modelo Sequelize de Roles. Define columnas, tipos y reglas de la tabla que usa el backend.
  Buscar en VS Code: modelo roles, tabla roles, columnas, tenant_id, Sequelize, relaciones.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('roles', {
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
      unique: "roles_tenant_id_nombre_key"
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: "roles_tenant_id_nombre_key"
    },
    permisos: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'roles',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_roles_tenant",
        fields: [
          { name: "tenant_id" },
        ]
      },
      {
        name: "roles_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "roles_tenant_id_nombre_key",
        unique: true,
        fields: [
          { name: "tenant_id" },
          { name: "nombre" },
        ]
      },
    ]
  });
};
