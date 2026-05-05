/*
  Guia rapida para presentar:
  Modelo Sequelize de Facturas. Define columnas, tipos y reglas de la tabla que usa el backend.
  Buscar en VS Code: modelo facturas, tabla facturas, columnas, tenant_id, Sequelize, relaciones.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('facturas', {
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
    pedido_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    numero_factura: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    subtotal: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    impuestos: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    total: {
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
    tableName: 'facturas',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "facturas_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "idx_facturas_tenant",
        fields: [
          { name: "tenant_id" },
        ]
      },
    ]
  });
};
