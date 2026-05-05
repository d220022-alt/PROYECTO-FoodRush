/*
  Guia rapida para presentar:
  Modelo Sequelize de Archivos. Define columnas, tipos y reglas de la tabla que usa el backend.
  Buscar en VS Code: modelo archivos, tabla archivos, columnas, tenant_id, Sequelize, relaciones.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('archivos', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    tenant_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    nombre_original: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    ruta_storage: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    tipo_mime: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'archivos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "archivos_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
