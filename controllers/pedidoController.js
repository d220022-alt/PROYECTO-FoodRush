const {
  pedidos,
  estadospedidos,
  clientes,
  pedidoitems,
  pedidostracking,
  pedidosubicaciones,
  productos,
  facturas,
  pagos,
} = require('../models');
const { notifyOrderStatus } = require('../services/notificationService');

const DEFAULT_CANCELLED_STATUS_ID = 6;

const toNumber = (value, fallback = 0) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseLimit = (value) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return 100;
  return Math.min(Math.max(parsed, 1), 200);
};

const resolveCancelledStatusId = async () => {
  const statuses = await estadospedidos.findAll();
  const cancelled = statuses.find((status) => {
    const source = `${status.codigo || ''} ${status.descripcion || ''}`.toLowerCase();
    return source.includes('cancel') || source.includes('anul');
  });

  if (cancelled?.id) return cancelled.id;

  for (const fallbackId of [DEFAULT_CANCELLED_STATUS_ID, 5]) {
    const byId = await estadospedidos.findByPk(fallbackId);
    if (byId) return fallbackId;
  }

  return DEFAULT_CANCELLED_STATUS_ID;
};

const includeOrderRelations = [
  {
    model: estadospedidos,
    as: 'estado',
    attributes: ['id', 'codigo', 'descripcion']
  },
  {
    model: clientes,
    as: 'cliente',
    attributes: ['id', 'nombre', 'telefono', 'correo']
  },
  {
    model: pedidoitems,
    as: 'items',
    attributes: ['id', 'pedido_id', 'producto_id', 'cantidad', 'precio_unitario', 'subtotal'],
    required: false,
    include: [
      {
        model: productos,
        as: 'producto',
        attributes: ['id', 'nombre', 'precio'],
        required: false
      }
    ]
  },
  {
    model: pedidostracking,
    as: 'tracking',
    attributes: ['id', 'pedido_id', 'estado_id', 'nota', 'creado_en'],
    required: false
  },
  {
    model: pedidosubicaciones,
    as: 'ubicaciones',
    attributes: ['id', 'pedido_id', 'lat', 'lon', 'registrado_en'],
    required: false
  }
];

const normalizeOrderItems = (items = []) =>
  (Array.isArray(items) ? items : [])
    .map((item) => {
      const productId = item.producto_id ?? item.productId ?? item.id;
      const quantity = Math.max(1, toNumber(item.cantidad ?? item.qty, 1));
      const unitPrice = Math.max(0, toNumber(item.precio_unitario ?? item.price ?? item.precio, 0));

      if (!productId) return null;

      return {
        producto_id: productId,
        cantidad: quantity,
        precio_unitario: unitPrice,
        subtotal: toNumber(item.subtotal, unitPrice * quantity)
      };
    })
    .filter(Boolean);

const getRequestedLocation = (body = {}) => {
  const rawLat = body.lat ?? body.latitude ?? body.location?.lat ?? body.ubicacion?.lat;
  const rawLon = body.lon ?? body.lng ?? body.longitude ?? body.location?.lng ?? body.location?.lon ?? body.ubicacion?.lng ?? body.ubicacion?.lon;
  const lat = toNumber(rawLat, NaN);
  const lon = toNumber(rawLon, NaN);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { lat, lon };
};

const writeTrackingEntry = (pedidoId, estadoId, note, transaction) =>
  pedidostracking.create({
    pedido_id: pedidoId,
    estado_id: estadoId,
    nota: note,
    creado_en: new Date()
  }, { transaction });

const findCompleteOrder = (id) =>
  pedidos.findByPk(id, {
    include: includeOrderRelations,
    order: [
      [{ model: pedidostracking, as: 'tracking' }, 'creado_en', 'ASC'],
      [{ model: pedidosubicaciones, as: 'ubicaciones' }, 'registrado_en', 'ASC'],
    ]
  });

const pedidoController = {
  async listar(req, res) {
    try {
      console.log('Listando pedidos para tenant:', req.tenantId);

      const whereClause = {
        tenant_id: req.tenantId
      };

      if (req.query.cliente_id) {
        whereClause.cliente_id = req.query.cliente_id;
      }

      const data = await pedidos.findAll({
        where: whereClause,
        include: includeOrderRelations,
        order: [['creado_en', 'DESC']],
        limit: parseLimit(req.query.limit || req.query.limite)
      });

      res.json({
        success: true,
        data,
        message: data.length === 0 ? 'No hay pedidos para este tenant' : 'Pedidos encontrados'
      });
    } catch (error) {
      console.error('Error listando pedidos:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  },

  async obtener(req, res) {
    try {
      const { id } = req.params;

      const pedido = await pedidos.findOne({
        where: {
          id,
          tenant_id: req.tenantId
        },
        include: includeOrderRelations
      });

      if (!pedido) {
        return res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Pedido no encontrado'
        });
      }

      res.json({
        success: true,
        data: pedido
      });
    } catch (error) {
      console.error('Error obteniendo pedido:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  },

  async crear(req, res) {
    const t = await pedidos.sequelize.transaction();
    let committed = false;
    try {
      const {
        cliente_id,
        total,
        direccion_entrega,
        notas,
        items,
        metodo_pago,
        estado_id = 1,
        tipo_entrega = 'delivery',
      } = req.body;

      if (!cliente_id || !total) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Cliente y total requeridos'
        });
      }

      const normalizedItems = normalizeOrderItems(items);
      if (Array.isArray(items) && items.length > 0 && normalizedItems.length === 0) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'El pedido no tiene productos validos para guardar.'
        });
      }

      const pedido = await pedidos.create({
        tenant_id: req.tenantId,
        cliente_id,
        estado_id,
        total: parseFloat(total),
        direccion_entrega: direccion_entrega || '',
        tipo_entrega,
        notas: notas || '',
        creado_en: new Date(),
        actualizado_en: new Date()
      }, { transaction: t });

      if (normalizedItems.length > 0) {
        const itemsData = normalizedItems.map(item => ({
          pedido_id: pedido.id,
          ...item
        }));
        await pedidoitems.bulkCreate(itemsData, { transaction: t });
      }

      await writeTrackingEntry(pedido.id, estado_id, 'Pedido creado desde checkout', t);

      const requestedLocation = getRequestedLocation(req.body);
      if (requestedLocation) {
        await pedidosubicaciones.create({
          pedido_id: pedido.id,
          lat: requestedLocation.lat,
          lon: requestedLocation.lon,
          registrado_en: new Date()
        }, { transaction: t });
      }

      const factura = await facturas.create({
        tenant_id: req.tenantId,
        pedido_id: pedido.id,
        numero_factura: `FAC-${pedido.id}-${Date.now()}`,
        subtotal: parseFloat(total),
        impuestos: 0,
        total: parseFloat(total),
        creado_en: new Date()
      }, { transaction: t });

      let metodoId = null;
      if (metodo_pago === 'cash') metodoId = 1;
      if (metodo_pago === 'card') metodoId = 2;
      if (metodo_pago === 'paypal') metodoId = 3;

      await pagos.create({
        pedido_id: pedido.id,
        factura_id: factura.id,
        metodo_id: metodoId,
        monto: parseFloat(total),
        referencia: metodo_pago === 'cash' ? 'Pago en entrega' : 'Simulacion',
        estado: 'Aprobado',
        creado_en: new Date()
      }, { transaction: t });

      await t.commit();
      committed = true;

      const pedidoCompleto = await findCompleteOrder(pedido.id);

      await notifyOrderStatus({
        tenantId: req.tenantId,
        order: pedidoCompleto,
        statusId: pedidoCompleto.estado_id,
        event: 'order-created',
        note: 'Pedido creado desde checkout'
      });

      res.status(201).json({
        success: true,
        message: 'Pedido, items, factura y pago creados exitosamente',
        data: pedidoCompleto
      });
    } catch (error) {
      if (!committed) await t.rollback();
      console.error('Error creando pedido completo:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  },

  async actualizar(req, res) {
    const t = await pedidos.sequelize.transaction();
    let committed = false;
    try {
      const { id } = req.params;
      const { estado_id, nota } = req.body;

      if (!estado_id) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Se requiere el nuevo estado del pedido.'
        });
      }

      const pedido = await pedidos.findOne({
        where: {
          id,
          tenant_id: req.tenantId
        }
      });

      if (!pedido) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Pedido no encontrado'
        });
      }

      await pedido.update({ estado_id, actualizado_en: new Date() }, { transaction: t });
      await writeTrackingEntry(pedido.id, estado_id, nota || 'Estado actualizado', t);

      await t.commit();
      committed = true;

      const pedidoActualizado = await findCompleteOrder(pedido.id);

      await notifyOrderStatus({
        tenantId: req.tenantId,
        order: pedidoActualizado,
        statusId: estado_id,
        event: 'order-updated'
      });

      res.json({
        success: true,
        message: 'Pedido actualizado exitosamente',
        data: pedidoActualizado
      });
    } catch (error) {
      if (!committed) await t.rollback();
      console.error('Error actualizando pedido:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  },

  async cancelar(req, res) {
    const t = await pedidos.sequelize.transaction();
    let committed = false;
    try {
      const { id } = req.params;

      const pedido = await pedidos.findOne({
        where: {
          id,
          tenant_id: req.tenantId
        }
      });

      if (!pedido) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Pedido no encontrado'
        });
      }

      const cancelledStatusId = await resolveCancelledStatusId();
      await pedido.update({ estado_id: cancelledStatusId, actualizado_en: new Date() }, { transaction: t });
      await writeTrackingEntry(pedido.id, cancelledStatusId, 'Pedido cancelado', t);

      await t.commit();
      committed = true;

      const pedidoCancelado = await findCompleteOrder(pedido.id);

      await notifyOrderStatus({
        tenantId: req.tenantId,
        order: pedidoCancelado,
        statusId: cancelledStatusId,
        event: 'order-cancelled'
      });

      res.json({
        success: true,
        message: 'Pedido cancelado exitosamente',
        data: pedidoCancelado
      });
    } catch (error) {
      if (!committed) await t.rollback();
      console.error('Error cancelando pedido:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  }
};

module.exports = pedidoController;
