const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pedidos', {
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
      }
    },
    sucursal_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'sucursales',
        key: 'id'
      }
    },
    cliente_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'clientes',
        key: 'id'
      }
    },
    usuario_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    total: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    },
    estado_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'estadospedidos',
        key: 'id'
      }
    },
    direccion_entrega_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'clientesdirecciones',
        key: 'id'
      }
    },
    tipo_entrega: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    actualizado_en: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'pedidos',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "idx_pedidos_tenant_creado",
        fields: [
          { name: "tenant_id" },
          { name: "creado_en", order: "DESC" },
        ]
      },
      {
        name: "idx_pedidos_tenant_estado",
        fields: [
          { name: "tenant_id" },
          { name: "estado_id" },
        ]
      },
      {
        name: "idx_pedidos_tenant_fecha",
        fields: [
          { name: "tenant_id" },
          { name: "creado_en", order: "DESC" },
        ]
      },
      {
        name: "pedidos_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
