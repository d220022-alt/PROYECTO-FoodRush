const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('horarios_especiales', {
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
      },
      unique: "horarios_especiales_sucursal_id_fecha_key"
    },
    tenant_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'tenants',
        key: 'id'
      }
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: "horarios_especiales_sucursal_id_fecha_key"
    },
    abre: {
      type: DataTypes.TIME,
      allowNull: true
    },
    cierra: {
      type: DataTypes.TIME,
      allowNull: true
    },
    cerrado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    motivo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'horarios_especiales',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "horarios_especiales_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "horarios_especiales_sucursal_id_fecha_key",
        unique: true,
        fields: [
          { name: "sucursal_id" },
          { name: "fecha" },
        ]
      },
      {
        name: "idx_horarios_especiales_sucursal",
        fields: [
          { name: "sucursal_id" },
        ]
      },
    ]
  });
};
