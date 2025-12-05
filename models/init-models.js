var DataTypes = require("sequelize").DataTypes;
var _accesosfallidos = require("./accesosfallidos");
var _archivos = require("./archivos");
var _auditlogs = require("./auditlogs");
var _categorias = require("./categorias");
var _clientes = require("./clientes");
var _clientes_dispositivos = require("./clientes_dispositivos");
var _clientes_historial = require("./clientes_historial");
var _clientes_tarjetas = require("./clientes_tarjetas");
var _clientesdirecciones = require("./clientesdirecciones");
var _clientesfavoritos = require("./clientesfavoritos");
var _errores_sistema = require("./errores_sistema");
var _estadospedidos = require("./estadospedidos");
var _facturas = require("./facturas");
var _facturaslineas = require("./facturaslineas");
var _horarios_especiales = require("./horarios_especiales");
var _metodospago = require("./metodospago");
var _notificaciones = require("./notificaciones");
var _pagos = require("./pagos");
var _pagos_reembolsos = require("./pagos_reembolsos");
var _pagos_transacciones = require("./pagos_transacciones");
var _pagosintentos = require("./pagosintentos");
var _pedidoitemopciones = require("./pedidoitemopciones");
var _pedidoitems = require("./pedidoitems");
var _pedidos = require("./pedidos");
var _pedidos_calificaciones = require("./pedidos_calificaciones");
var _pedidos_cancelaciones = require("./pedidos_cancelaciones");
var _pedidos_reembolsos = require("./pedidos_reembolsos");
var _pedidostracking = require("./pedidostracking");
var _pedidosubicaciones = require("./pedidosubicaciones");
var _permisos = require("./permisos");
var _productos = require("./productos");
var _productos_agotados = require("./productos_agotados");
var _productos_historial_precios = require("./productos_historial_precios");
var _productos_imagenes = require("./productos_imagenes");
var _productosimpuestos = require("./productosimpuestos");
var _productosopciones = require("./productosopciones");
var _productosopcionesgrupo = require("./productosopcionesgrupo");
var _productosvariantes = require("./productosvariantes");
var _promociones = require("./promociones");
var _promociones_aplicaciones = require("./promociones_aplicaciones");
var _repartidorasignaciones = require("./repartidorasignaciones");
var _repartidores = require("./repartidores");
var _repartidores_dispositivos = require("./repartidores_dispositivos");
var _repartidores_documentos = require("./repartidores_documentos");
var _repartidores_vehiculos = require("./repartidores_vehiculos");
var _repartidortracking = require("./repartidortracking");
var _roles = require("./roles");
var _rutas = require("./rutas");
var _sesionesusuarios = require("./sesionesusuarios");
var _sucursal_cierres_temporales = require("./sucursal_cierres_temporales");
var _sucursal_config = require("./sucursal_config");
var _sucursal_historial = require("./sucursal_historial");
var _sucursales = require("./sucursales");
var _sucursaleszonascobertura = require("./sucursaleszonascobertura");
var _sucursalhorarios = require("./sucursalhorarios");
var _sucursalmetodospago = require("./sucursalmetodospago");
var _sucursaltiposentrega = require("./sucursaltiposentrega");
var _tareas_programadas = require("./tareas_programadas");
var _tenant_billing = require("./tenant_billing");
var _tenant_plans = require("./tenant_plans");
var _tenant_settings_extra = require("./tenant_settings_extra");
var _tenants = require("./tenants");
var _tenantsettings = require("./tenantsettings");
var _usuarios = require("./usuarios");
var _webhookslog = require("./webhookslog");

function initModels(sequelize) {
  var accesosfallidos = _accesosfallidos(sequelize, DataTypes);
  var archivos = _archivos(sequelize, DataTypes);
  var auditlogs = _auditlogs(sequelize, DataTypes);
  var categorias = _categorias(sequelize, DataTypes);
  var clientes = _clientes(sequelize, DataTypes);
  var clientes_dispositivos = _clientes_dispositivos(sequelize, DataTypes);
  var clientes_historial = _clientes_historial(sequelize, DataTypes);
  var clientes_tarjetas = _clientes_tarjetas(sequelize, DataTypes);
  var clientesdirecciones = _clientesdirecciones(sequelize, DataTypes);
  var clientesfavoritos = _clientesfavoritos(sequelize, DataTypes);
  var errores_sistema = _errores_sistema(sequelize, DataTypes);
  var estadospedidos = _estadospedidos(sequelize, DataTypes);
  var facturas = _facturas(sequelize, DataTypes);
  var facturaslineas = _facturaslineas(sequelize, DataTypes);
  var horarios_especiales = _horarios_especiales(sequelize, DataTypes);
  var metodospago = _metodospago(sequelize, DataTypes);
  var notificaciones = _notificaciones(sequelize, DataTypes);
  var pagos = _pagos(sequelize, DataTypes);
  var pagos_reembolsos = _pagos_reembolsos(sequelize, DataTypes);
  var pagos_transacciones = _pagos_transacciones(sequelize, DataTypes);
  var pagosintentos = _pagosintentos(sequelize, DataTypes);
  var pedidoitemopciones = _pedidoitemopciones(sequelize, DataTypes);
  var pedidoitems = _pedidoitems(sequelize, DataTypes);
  var pedidos = _pedidos(sequelize, DataTypes);
  var pedidos_calificaciones = _pedidos_calificaciones(sequelize, DataTypes);
  var pedidos_cancelaciones = _pedidos_cancelaciones(sequelize, DataTypes);
  var pedidos_reembolsos = _pedidos_reembolsos(sequelize, DataTypes);
  var pedidostracking = _pedidostracking(sequelize, DataTypes);
  var pedidosubicaciones = _pedidosubicaciones(sequelize, DataTypes);
  var permisos = _permisos(sequelize, DataTypes);
  var productos = _productos(sequelize, DataTypes);
  var productos_agotados = _productos_agotados(sequelize, DataTypes);
  var productos_historial_precios = _productos_historial_precios(sequelize, DataTypes);
  var productos_imagenes = _productos_imagenes(sequelize, DataTypes);
  var productosimpuestos = _productosimpuestos(sequelize, DataTypes);
  var productosopciones = _productosopciones(sequelize, DataTypes);
  var productosopcionesgrupo = _productosopcionesgrupo(sequelize, DataTypes);
  var productosvariantes = _productosvariantes(sequelize, DataTypes);
  var promociones = _promociones(sequelize, DataTypes);
  var promociones_aplicaciones = _promociones_aplicaciones(sequelize, DataTypes);
  var repartidorasignaciones = _repartidorasignaciones(sequelize, DataTypes);
  var repartidores = _repartidores(sequelize, DataTypes);
  var repartidores_dispositivos = _repartidores_dispositivos(sequelize, DataTypes);
  var repartidores_documentos = _repartidores_documentos(sequelize, DataTypes);
  var repartidores_vehiculos = _repartidores_vehiculos(sequelize, DataTypes);
  var repartidortracking = _repartidortracking(sequelize, DataTypes);
  var roles = _roles(sequelize, DataTypes);
  var rutas = _rutas(sequelize, DataTypes);
  var sesionesusuarios = _sesionesusuarios(sequelize, DataTypes);
  var sucursal_cierres_temporales = _sucursal_cierres_temporales(sequelize, DataTypes);
  var sucursal_config = _sucursal_config(sequelize, DataTypes);
  var sucursal_historial = _sucursal_historial(sequelize, DataTypes);
  var sucursales = _sucursales(sequelize, DataTypes);
  var sucursaleszonascobertura = _sucursaleszonascobertura(sequelize, DataTypes);
  var sucursalhorarios = _sucursalhorarios(sequelize, DataTypes);
  var sucursalmetodospago = _sucursalmetodospago(sequelize, DataTypes);
  var sucursaltiposentrega = _sucursaltiposentrega(sequelize, DataTypes);
  var tareas_programadas = _tareas_programadas(sequelize, DataTypes);
  var tenant_billing = _tenant_billing(sequelize, DataTypes);
  var tenant_plans = _tenant_plans(sequelize, DataTypes);
  var tenant_settings_extra = _tenant_settings_extra(sequelize, DataTypes);
  var tenants = _tenants(sequelize, DataTypes);
  var tenantsettings = _tenantsettings(sequelize, DataTypes);
  var usuarios = _usuarios(sequelize, DataTypes);
  var webhookslog = _webhookslog(sequelize, DataTypes);

  productos.belongsTo(categorias, { as: "categorium", foreignKey: "categoria_id"});
  categorias.hasMany(productos, { as: "productos", foreignKey: "categoria_id"});
  clientes_dispositivos.belongsTo(clientes, { as: "cliente", foreignKey: "cliente_id"});
  clientes.hasMany(clientes_dispositivos, { as: "clientes_dispositivos", foreignKey: "cliente_id"});
  clientes_historial.belongsTo(clientes, { as: "cliente", foreignKey: "cliente_id"});
  clientes.hasMany(clientes_historial, { as: "clientes_historials", foreignKey: "cliente_id"});
  clientes_tarjetas.belongsTo(clientes, { as: "cliente", foreignKey: "cliente_id"});
  clientes.hasMany(clientes_tarjetas, { as: "clientes_tarjeta", foreignKey: "cliente_id"});
  clientesdirecciones.belongsTo(clientes, { as: "cliente", foreignKey: "cliente_id"});
  clientes.hasMany(clientesdirecciones, { as: "clientesdirecciones", foreignKey: "cliente_id"});
  clientesfavoritos.belongsTo(clientes, { as: "cliente", foreignKey: "cliente_id"});
  clientes.hasMany(clientesfavoritos, { as: "clientesfavoritos", foreignKey: "cliente_id"});
  pedidos.belongsTo(clientes, { as: "cliente", foreignKey: "cliente_id"});
  clientes.hasMany(pedidos, { as: "pedidos", foreignKey: "cliente_id"});
  promociones_aplicaciones.belongsTo(clientes, { as: "cliente", foreignKey: "cliente_id"});
  clientes.hasMany(promociones_aplicaciones, { as: "promociones_aplicaciones", foreignKey: "cliente_id"});
  pedidos.belongsTo(clientesdirecciones, { as: "direccion_entrega", foreignKey: "direccion_entrega_id"});
  clientesdirecciones.hasMany(pedidos, { as: "pedidos", foreignKey: "direccion_entrega_id"});
  pedidos.belongsTo(estadospedidos, { as: "estado", foreignKey: "estado_id"});
  estadospedidos.hasMany(pedidos, { as: "pedidos", foreignKey: "estado_id"});
  pedidostracking.belongsTo(estadospedidos, { as: "estado", foreignKey: "estado_id"});
  estadospedidos.hasMany(pedidostracking, { as: "pedidostrackings", foreignKey: "estado_id"});
  facturaslineas.belongsTo(facturas, { as: "factura", foreignKey: "factura_id"});
  facturas.hasMany(facturaslineas, { as: "facturaslineas", foreignKey: "factura_id"});
  pagos.belongsTo(facturas, { as: "factura", foreignKey: "factura_id"});
  facturas.hasMany(pagos, { as: "pagos", foreignKey: "factura_id"});
  pagos.belongsTo(metodospago, { as: "metodo", foreignKey: "metodo_id"});
  metodospago.hasMany(pagos, { as: "pagos", foreignKey: "metodo_id"});
  pagos_reembolsos.belongsTo(pagos, { as: "pago", foreignKey: "pago_id"});
  pagos.hasMany(pagos_reembolsos, { as: "pagos_reembolsos", foreignKey: "pago_id"});
  pagos_transacciones.belongsTo(pagos, { as: "pago", foreignKey: "pago_id"});
  pagos.hasMany(pagos_transacciones, { as: "pagos_transacciones", foreignKey: "pago_id"});
  pagosintentos.belongsTo(pagos, { as: "pago", foreignKey: "pago_id"});
  pagos.hasMany(pagosintentos, { as: "pagosintentos", foreignKey: "pago_id"});
  pedidos_reembolsos.belongsTo(pagos, { as: "pago", foreignKey: "pago_id"});
  pagos.hasMany(pedidos_reembolsos, { as: "pedidos_reembolsos", foreignKey: "pago_id"});
  pedidoitemopciones.belongsTo(pedidoitems, { as: "pedidoitem", foreignKey: "pedidoitem_id"});
  pedidoitems.hasMany(pedidoitemopciones, { as: "pedidoitemopciones", foreignKey: "pedidoitem_id"});
  facturas.belongsTo(pedidos, { as: "pedido", foreignKey: "pedido_id"});
  pedidos.hasMany(facturas, { as: "facturas", foreignKey: "pedido_id"});
  pagos.belongsTo(pedidos, { as: "pedido", foreignKey: "pedido_id"});
  pedidos.hasMany(pagos, { as: "pagos", foreignKey: "pedido_id"});
  pedidoitems.belongsTo(pedidos, { as: "pedido", foreignKey: "pedido_id"});
  pedidos.hasMany(pedidoitems, { as: "pedidoitems", foreignKey: "pedido_id"});
  pedidos_calificaciones.belongsTo(pedidos, { as: "pedido", foreignKey: "pedido_id"});
  pedidos.hasMany(pedidos_calificaciones, { as: "pedidos_calificaciones", foreignKey: "pedido_id"});
  pedidos_cancelaciones.belongsTo(pedidos, { as: "pedido", foreignKey: "pedido_id"});
  pedidos.hasMany(pedidos_cancelaciones, { as: "pedidos_cancelaciones", foreignKey: "pedido_id"});
  pedidos_reembolsos.belongsTo(pedidos, { as: "pedido", foreignKey: "pedido_id"});
  pedidos.hasMany(pedidos_reembolsos, { as: "pedidos_reembolsos", foreignKey: "pedido_id"});
  pedidostracking.belongsTo(pedidos, { as: "pedido", foreignKey: "pedido_id"});
  pedidos.hasMany(pedidostracking, { as: "pedidostrackings", foreignKey: "pedido_id"});
  pedidosubicaciones.belongsTo(pedidos, { as: "pedido", foreignKey: "pedido_id"});
  pedidos.hasMany(pedidosubicaciones, { as: "pedidosubicaciones", foreignKey: "pedido_id"});
  promociones_aplicaciones.belongsTo(pedidos, { as: "pedido", foreignKey: "pedido_id"});
  pedidos.hasMany(promociones_aplicaciones, { as: "promociones_aplicaciones", foreignKey: "pedido_id"});
  repartidorasignaciones.belongsTo(pedidos, { as: "pedido", foreignKey: "pedido_id"});
  pedidos.hasMany(repartidorasignaciones, { as: "repartidorasignaciones", foreignKey: "pedido_id"});
  pedidoitems.belongsTo(productos, { as: "producto", foreignKey: "producto_id"});
  productos.hasMany(pedidoitems, { as: "pedidoitems", foreignKey: "producto_id"});
  productos_agotados.belongsTo(productos, { as: "producto", foreignKey: "producto_id"});
  productos.hasMany(productos_agotados, { as: "productos_agotados", foreignKey: "producto_id"});
  productos_historial_precios.belongsTo(productos, { as: "producto", foreignKey: "producto_id"});
  productos.hasMany(productos_historial_precios, { as: "productos_historial_precios", foreignKey: "producto_id"});
  productos_imagenes.belongsTo(productos, { as: "producto", foreignKey: "producto_id"});
  productos.hasMany(productos_imagenes, { as: "productos_imagenes", foreignKey: "producto_id"});
  productosimpuestos.belongsTo(productos, { as: "producto", foreignKey: "producto_id"});
  productos.hasMany(productosimpuestos, { as: "productosimpuestos", foreignKey: "producto_id"});
  productosvariantes.belongsTo(productos, { as: "producto", foreignKey: "producto_id"});
  productos.hasMany(productosvariantes, { as: "productosvariantes", foreignKey: "producto_id"});
  pedidoitemopciones.belongsTo(productosopciones, { as: "opcion", foreignKey: "opcion_id"});
  productosopciones.hasMany(pedidoitemopciones, { as: "pedidoitemopciones", foreignKey: "opcion_id"});
  productosopciones.belongsTo(productosopcionesgrupo, { as: "grupo", foreignKey: "grupo_id"});
  productosopcionesgrupo.hasMany(productosopciones, { as: "productosopciones", foreignKey: "grupo_id"});
  pedidoitems.belongsTo(productosvariantes, { as: "variante", foreignKey: "variante_id"});
  productosvariantes.hasMany(pedidoitems, { as: "pedidoitems", foreignKey: "variante_id"});
  productos_agotados.belongsTo(productosvariantes, { as: "variante", foreignKey: "variante_id"});
  productosvariantes.hasMany(productos_agotados, { as: "productos_agotados", foreignKey: "variante_id"});
  promociones_aplicaciones.belongsTo(promociones, { as: "promocion", foreignKey: "promocion_id"});
  promociones.hasMany(promociones_aplicaciones, { as: "promociones_aplicaciones", foreignKey: "promocion_id"});
  repartidorasignaciones.belongsTo(repartidores, { as: "repartidor", foreignKey: "repartidor_id"});
  repartidores.hasMany(repartidorasignaciones, { as: "repartidorasignaciones", foreignKey: "repartidor_id"});
  repartidores_dispositivos.belongsTo(repartidores, { as: "repartidor", foreignKey: "repartidor_id"});
  repartidores.hasMany(repartidores_dispositivos, { as: "repartidores_dispositivos", foreignKey: "repartidor_id"});
  repartidores_documentos.belongsTo(repartidores, { as: "repartidor", foreignKey: "repartidor_id"});
  repartidores.hasMany(repartidores_documentos, { as: "repartidores_documentos", foreignKey: "repartidor_id"});
  repartidores_vehiculos.belongsTo(repartidores, { as: "repartidor", foreignKey: "repartidor_id"});
  repartidores.hasMany(repartidores_vehiculos, { as: "repartidores_vehiculos", foreignKey: "repartidor_id"});
  repartidortracking.belongsTo(repartidores, { as: "repartidor", foreignKey: "repartidor_id"});
  repartidores.hasMany(repartidortracking, { as: "repartidortrackings", foreignKey: "repartidor_id"});
  usuarios.belongsTo(roles, { as: "rol", foreignKey: "rol_id"});
  roles.hasMany(usuarios, { as: "usuarios", foreignKey: "rol_id"});
  clientesfavoritos.belongsTo(sucursales, { as: "sucursal", foreignKey: "sucursal_id"});
  sucursales.hasMany(clientesfavoritos, { as: "clientesfavoritos", foreignKey: "sucursal_id"});
  horarios_especiales.belongsTo(sucursales, { as: "sucursal", foreignKey: "sucursal_id"});
  sucursales.hasMany(horarios_especiales, { as: "horarios_especiales", foreignKey: "sucursal_id"});
  pedidos.belongsTo(sucursales, { as: "sucursal", foreignKey: "sucursal_id"});
  sucursales.hasMany(pedidos, { as: "pedidos", foreignKey: "sucursal_id"});
  sucursal_cierres_temporales.belongsTo(sucursales, { as: "sucursal", foreignKey: "sucursal_id"});
  sucursales.hasMany(sucursal_cierres_temporales, { as: "sucursal_cierres_temporales", foreignKey: "sucursal_id"});
  sucursal_config.belongsTo(sucursales, { as: "sucursal", foreignKey: "sucursal_id"});
  sucursales.hasMany(sucursal_config, { as: "sucursal_configs", foreignKey: "sucursal_id"});
  sucursal_historial.belongsTo(sucursales, { as: "sucursal", foreignKey: "sucursal_id"});
  sucursales.hasMany(sucursal_historial, { as: "sucursal_historials", foreignKey: "sucursal_id"});
  sucursaleszonascobertura.belongsTo(sucursales, { as: "sucursal", foreignKey: "sucursal_id"});
  sucursales.hasMany(sucursaleszonascobertura, { as: "sucursaleszonascoberturas", foreignKey: "sucursal_id"});
  sucursalhorarios.belongsTo(sucursales, { as: "sucursal", foreignKey: "sucursal_id"});
  sucursales.hasMany(sucursalhorarios, { as: "sucursalhorarios", foreignKey: "sucursal_id"});
  sucursalmetodospago.belongsTo(sucursales, { as: "sucursal", foreignKey: "sucursal_id"});
  sucursales.hasMany(sucursalmetodospago, { as: "sucursalmetodospagos", foreignKey: "sucursal_id"});
  sucursaltiposentrega.belongsTo(sucursales, { as: "sucursal", foreignKey: "sucursal_id"});
  sucursales.hasMany(sucursaltiposentrega, { as: "sucursaltiposentregas", foreignKey: "sucursal_id"});
  tenant_billing.belongsTo(tenant_plans, { as: "plan", foreignKey: "plan_id"});
  tenant_plans.hasMany(tenant_billing, { as: "tenant_billings", foreignKey: "plan_id"});
  archivos.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(archivos, { as: "archivos", foreignKey: "tenant_id"});
  auditlogs.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(auditlogs, { as: "auditlogs", foreignKey: "tenant_id"});
  categorias.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(categorias, { as: "categoria", foreignKey: "tenant_id"});
  clientes.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(clientes, { as: "clientes", foreignKey: "tenant_id"});
  clientes_dispositivos.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(clientes_dispositivos, { as: "clientes_dispositivos", foreignKey: "tenant_id"});
  clientes_historial.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(clientes_historial, { as: "clientes_historials", foreignKey: "tenant_id"});
  clientes_tarjetas.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(clientes_tarjetas, { as: "clientes_tarjeta", foreignKey: "tenant_id"});
  errores_sistema.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(errores_sistema, { as: "errores_sistemas", foreignKey: "tenant_id"});
  facturas.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(facturas, { as: "facturas", foreignKey: "tenant_id"});
  horarios_especiales.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(horarios_especiales, { as: "horarios_especiales", foreignKey: "tenant_id"});
  notificaciones.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(notificaciones, { as: "notificaciones", foreignKey: "tenant_id"});
  pagos_reembolsos.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(pagos_reembolsos, { as: "pagos_reembolsos", foreignKey: "tenant_id"});
  pagos_transacciones.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(pagos_transacciones, { as: "pagos_transacciones", foreignKey: "tenant_id"});
  pedidos.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(pedidos, { as: "pedidos", foreignKey: "tenant_id"});
  pedidos_calificaciones.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(pedidos_calificaciones, { as: "pedidos_calificaciones", foreignKey: "tenant_id"});
  pedidos_cancelaciones.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(pedidos_cancelaciones, { as: "pedidos_cancelaciones", foreignKey: "tenant_id"});
  pedidos_reembolsos.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(pedidos_reembolsos, { as: "pedidos_reembolsos", foreignKey: "tenant_id"});
  permisos.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(permisos, { as: "permisos", foreignKey: "tenant_id"});
  productos.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(productos, { as: "productos", foreignKey: "tenant_id"});
  productos_agotados.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(productos_agotados, { as: "productos_agotados", foreignKey: "tenant_id"});
  productos_historial_precios.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(productos_historial_precios, { as: "productos_historial_precios", foreignKey: "tenant_id"});
  productos_imagenes.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(productos_imagenes, { as: "productos_imagenes", foreignKey: "tenant_id"});
  productosopcionesgrupo.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(productosopcionesgrupo, { as: "productosopcionesgrupos", foreignKey: "tenant_id"});
  promociones.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(promociones, { as: "promociones", foreignKey: "tenant_id"});
  promociones_aplicaciones.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(promociones_aplicaciones, { as: "promociones_aplicaciones", foreignKey: "tenant_id"});
  repartidores.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(repartidores, { as: "repartidores", foreignKey: "tenant_id"});
  repartidores_dispositivos.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(repartidores_dispositivos, { as: "repartidores_dispositivos", foreignKey: "tenant_id"});
  repartidores_documentos.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(repartidores_documentos, { as: "repartidores_documentos", foreignKey: "tenant_id"});
  repartidores_vehiculos.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(repartidores_vehiculos, { as: "repartidores_vehiculos", foreignKey: "tenant_id"});
  roles.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(roles, { as: "roles", foreignKey: "tenant_id"});
  rutas.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(rutas, { as: "ruta", foreignKey: "tenant_id"});
  sucursal_cierres_temporales.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(sucursal_cierres_temporales, { as: "sucursal_cierres_temporales", foreignKey: "tenant_id"});
  sucursal_config.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(sucursal_config, { as: "sucursal_configs", foreignKey: "tenant_id"});
  sucursal_historial.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(sucursal_historial, { as: "sucursal_historials", foreignKey: "tenant_id"});
  sucursales.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(sucursales, { as: "sucursales", foreignKey: "tenant_id"});
  tareas_programadas.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(tareas_programadas, { as: "tareas_programadas", foreignKey: "tenant_id"});
  tenant_billing.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(tenant_billing, { as: "tenant_billings", foreignKey: "tenant_id"});
  tenant_settings_extra.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(tenant_settings_extra, { as: "tenant_settings_extras", foreignKey: "tenant_id"});
  tenantsettings.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(tenantsettings, { as: "tenantsettings", foreignKey: "tenant_id"});
  usuarios.belongsTo(tenants, { as: "tenant", foreignKey: "tenant_id"});
  tenants.hasMany(usuarios, { as: "usuarios", foreignKey: "tenant_id"});
  accesosfallidos.belongsTo(usuarios, { as: "usuario", foreignKey: "usuario_id"});
  usuarios.hasMany(accesosfallidos, { as: "accesosfallidos", foreignKey: "usuario_id"});
  auditlogs.belongsTo(usuarios, { as: "usuario", foreignKey: "usuario_id"});
  usuarios.hasMany(auditlogs, { as: "auditlogs", foreignKey: "usuario_id"});
  pedidos.belongsTo(usuarios, { as: "usuario", foreignKey: "usuario_id"});
  usuarios.hasMany(pedidos, { as: "pedidos", foreignKey: "usuario_id"});
  pedidos_cancelaciones.belongsTo(usuarios, { as: "usuario", foreignKey: "usuario_id"});
  usuarios.hasMany(pedidos_cancelaciones, { as: "pedidos_cancelaciones", foreignKey: "usuario_id"});
  productos_historial_precios.belongsTo(usuarios, { as: "cambiado_por_usuario", foreignKey: "cambiado_por"});
  usuarios.hasMany(productos_historial_precios, { as: "productos_historial_precios", foreignKey: "cambiado_por"});
  sesionesusuarios.belongsTo(usuarios, { as: "usuario", foreignKey: "usuario_id"});
  usuarios.hasMany(sesionesusuarios, { as: "sesionesusuarios", foreignKey: "usuario_id"});
  sucursal_historial.belongsTo(usuarios, { as: "cambiado_por_usuario", foreignKey: "cambiado_por"});
  usuarios.hasMany(sucursal_historial, { as: "sucursal_historials", foreignKey: "cambiado_por"});

  return {
    accesosfallidos,
    archivos,
    auditlogs,
    categorias,
    clientes,
    clientes_dispositivos,
    clientes_historial,
    clientes_tarjetas,
    clientesdirecciones,
    clientesfavoritos,
    errores_sistema,
    estadospedidos,
    facturas,
    facturaslineas,
    horarios_especiales,
    metodospago,
    notificaciones,
    pagos,
    pagos_reembolsos,
    pagos_transacciones,
    pagosintentos,
    pedidoitemopciones,
    pedidoitems,
    pedidos,
    pedidos_calificaciones,
    pedidos_cancelaciones,
    pedidos_reembolsos,
    pedidostracking,
    pedidosubicaciones,
    permisos,
    productos,
    productos_agotados,
    productos_historial_precios,
    productos_imagenes,
    productosimpuestos,
    productosopciones,
    productosopcionesgrupo,
    productosvariantes,
    promociones,
    promociones_aplicaciones,
    repartidorasignaciones,
    repartidores,
    repartidores_dispositivos,
    repartidores_documentos,
    repartidores_vehiculos,
    repartidortracking,
    roles,
    rutas,
    sesionesusuarios,
    sucursal_cierres_temporales,
    sucursal_config,
    sucursal_historial,
    sucursales,
    sucursaleszonascobertura,
    sucursalhorarios,
    sucursalmetodospago,
    sucursaltiposentrega,
    tareas_programadas,
    tenant_billing,
    tenant_plans,
    tenant_settings_extra,
    tenants,
    tenantsettings,
    usuarios,
    webhookslog,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
