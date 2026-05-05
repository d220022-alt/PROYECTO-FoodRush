/*
  Guia rapida para presentar:
  Modelo Sequelize de Sucursales. Define columnas, tipos y reglas de la tabla que usa el backend.
  Buscar en VS Code: modelo sucursales, tabla sucursales, columnas, tenant_id, Sequelize, relaciones.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sucursales', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    tenant_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    direccion: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    ciudad: {
      type: DataTypes.STRING(200),
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
    tableName: 'sucursales',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "idx_sucursales_tenant",
        fields: [
          { name: "tenant_id" },
        ]
      },
      {
        name: "sucursales_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
