const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tareas_programadas', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    tenant_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'tenants',
        key: 'id'
      }
    },
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cron_expresion: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    ultimo_ejecucion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "activo"
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'tareas_programadas',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_tareas_programadas_tenant",
        fields: [
          { name: "tenant_id" },
        ]
      },
      {
        name: "tareas_programadas_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
