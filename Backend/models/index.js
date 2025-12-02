const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// IMPORTAR MODELOS
const Tenant = require('./Tenant')(sequelize, DataTypes);
const TenantSetting = require('./TenantSetting')(sequelize, DataTypes);
const Rol = require('./Rol')(sequelize, DataTypes);
const Usuario = require('./Usuario')(sequelize, DataTypes);
const Sucursal = require('./Sucursal')(sequelize, DataTypes);
const Categoria = require('./Categoria')(sequelize, DataTypes);
const Producto = require('./Producto')(sequelize, DataTypes);
const Inventario = require('./Inventario')(sequelize, DataTypes);
const Cliente = require('./Cliente')(sequelize, DataTypes);
const Pedido = require('./Pedido')(sequelize, DataTypes);
const PedidoItem = require('./PedidoItem')(sequelize, DataTypes);
const Factura = require('./Factura')(sequelize, DataTypes);
const Pago = require('./Pago')(sequelize, DataTypes);
const AuditLog = require('./AuditLog')(sequelize, DataTypes);

// RELACIONES…

Tenant.hasMany(Usuario, { foreignKey: 'tenantId' });
Usuario.belongsTo(Tenant, { foreignKey: 'tenantId' });

Tenant.hasMany(Rol, { foreignKey: 'tenantId' });
Rol.belongsTo(Tenant, { foreignKey: 'tenantId' });

Tenant.hasMany(Sucursal, { foreignKey: 'tenantId' });
Sucursal.belongsTo(Tenant, { foreignKey: 'tenantId' });

Tenant.hasMany(Categoria, { foreignKey: 'tenantId' });
Categoria.belongsTo(Tenant, { foreignKey: 'tenantId' });

Tenant.hasMany(Producto, { foreignKey: 'tenantId' });
Producto.belongsTo(Tenant, { foreignKey: 'tenantId' });

Categoria.hasMany(Producto, { foreignKey: 'categoriaId' });
Producto.belongsTo(Categoria, { foreignKey: 'categoriaId' });

Sucursal.hasMany(Inventario, { foreignKey: 'sucursalId' });
Inventario.belongsTo(Sucursal, { foreignKey: 'sucursalId' });

Producto.hasMany(Inventario, { foreignKey: 'productoId' });
Inventario.belongsTo(Producto, { foreignKey: 'productoId' });

Cliente.hasMany(Pedido, { foreignKey: 'clienteId' });
Pedido.belongsTo(Cliente, { foreignKey: 'clienteId' });

Sucursal.hasMany(Pedido, { foreignKey: 'sucursalId' });
Pedido.belongsTo(Sucursal, { foreignKey: 'sucursalId' });

Usuario.hasMany(Pedido, { foreignKey: 'usuarioId' });
Pedido.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Pedido.hasMany(PedidoItem, { foreignKey: 'pedidoId' });
PedidoItem.belongsTo(Pedido, { foreignKey: 'pedidoId' });

Producto.hasMany(PedidoItem, { foreignKey: 'productoId' });
PedidoItem.belongsTo(Producto, { foreignKey: 'productoId' });

Pedido.hasOne(Factura, { foreignKey: 'pedidoId' });
Factura.belongsTo(Pedido, { foreignKey: 'pedidoId' });

Factura.hasMany(Pago, { foreignKey: 'facturaId' });
Pago.belongsTo(Factura, { foreignKey: 'facturaId' });

Usuario.hasMany(AuditLog, { foreignKey: 'usuarioId' });
AuditLog.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Tenant.hasMany(AuditLog, { foreignKey: 'tenantId' });
AuditLog.belongsTo(Tenant, { foreignKey: 'tenantId' });

// EXPORTAR
module.exports = {
  sequelize,
  Tenant,
  TenantSetting,
  Rol,
  Usuario,
  Sucursal,
  Categoria,
  Producto,
  Inventario,
  Cliente,
  Pedido,
  PedidoItem,
  Factura,
  Pago,
  AuditLog
};
