const sequelize = require('../config/database');

const Tenant = require('./Tenant');
const TenantSetting = require('./TenantSetting');
const Rol = require('./Rol');
const Usuario = require('./Usuario');
const Sucursal = require('./Sucursal');
const Categoria = require('./Categoria');
const Producto = require('./Producto');
const Inventario = require('./Inventario');
const Cliente = require('./Cliente');
const Pedido = require('./Pedido');
const PedidoItem = require('./PedidoItem');
const Factura = require('./Factura');
const Pago = require('./Pago');
const AuditLog = require('./AuditLog');

// TENANT RELATIONS
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

Tenant.hasMany(Cliente, { foreignKey: 'tenantId' });
Cliente.belongsTo(Tenant, { foreignKey: 'tenantId' });

Tenant.hasMany(Pedido, { foreignKey: 'tenantId' });
Pedido.belongsTo(Tenant, { foreignKey: 'tenantId' });

Tenant.hasMany(Factura, { foreignKey: 'tenantId' });
Factura.belongsTo(Tenant, { foreignKey: 'tenantId' });

// PRODUCT RELATIONS
Categoria.hasMany(Producto, { foreignKey: 'categoriaId' });
Producto.belongsTo(Categoria, { foreignKey: 'categoriaId' });

// INVENTORY RELATIONS
Sucursal.hasMany(Inventario, { foreignKey: 'sucursalId' });
Inventario.belongsTo(Sucursal, { foreignKey: 'sucursalId' });

Producto.hasMany(Inventario, { foreignKey: 'productoId' });
Inventario.belongsTo(Producto, { foreignKey: 'productoId' });

// CLIENT & ORDER RELATIONS
Cliente.hasMany(Pedido, { foreignKey: 'clienteId' });
Pedido.belongsTo(Cliente, { foreignKey: 'clienteId' });

Sucursal.hasMany(Pedido, { foreignKey: 'sucursalId' });
Pedido.belongsTo(Sucursal, { foreignKey: 'sucursalId' });

Usuario.hasMany(Pedido, { foreignKey: 'usuarioId' });
Pedido.belongsTo(Usuario, { foreignKey: 'usuarioId' });

// ORDER ITEMS
Pedido.hasMany(PedidoItem, { foreignKey: 'pedidoId' });
PedidoItem.belongsTo(Pedido, { foreignKey: 'pedidoId' });

Producto.hasMany(PedidoItem, { foreignKey: 'productoId' });
PedidoItem.belongsTo(Producto, { foreignKey: 'productoId' });

// FACTURAS
Pedido.hasOne(Factura, { foreignKey: 'pedidoId' });
Factura.belongsTo(Pedido, { foreignKey: 'pedidoId' });

// PAGOS
Factura.hasMany(Pago, { foreignKey: 'facturaId' });
Pago.belongsTo(Factura, { foreignKey: 'facturaId' });

// AUDIT LOGS
Usuario.hasMany(AuditLog, { foreignKey: 'usuarioId' });
AuditLog.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Tenant.hasMany(AuditLog, { foreignKey: 'tenantId' });
AuditLog.belongsTo(Tenant, { foreignKey: 'tenantId' });

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
