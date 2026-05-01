const { pedidos, estadospedidos, clientes } = require('../models');
const { notifyOrderStatus } = require('../services/notificationService');

const DEFAULT_CANCELLED_STATUS_ID = 5;

const resolveCancelledStatusId = async () => {
  const byId = await estadospedidos.findByPk(DEFAULT_CANCELLED_STATUS_ID);
  if (byId) return DEFAULT_CANCELLED_STATUS_ID;

  const statuses = await estadospedidos.findAll();
  const cancelled = statuses.find((status) => {
    const source = `${status.codigo || ''} ${status.descripcion || ''}`.toLowerCase();
    return source.includes('cancel');
  });

  return cancelled?.id || DEFAULT_CANCELLED_STATUS_ID;
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
  }
];

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
        include: includeOrderRelations.map((relation) => ({
          ...relation,
          attributes: relation.as === 'cliente' ? ['id', 'nombre', 'telefono'] : relation.attributes
        })),
        order: [['creado_en', 'DESC']],
        limit: 20
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
    try {
      const { cliente_id, total, direccion_entrega, notas, items, metodo_pago, estado_id = 1 } = req.body;

      if (!cliente_id || !total) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Cliente y total requeridos'
        });
      }

      const pedido = await pedidos.create({
        tenant_id: req.tenantId,
        cliente_id,
        estado_id,
        total: parseFloat(total),
        direccion_entrega: direccion_entrega || '',
        notas: notas || '',
        creado_en: new Date()
      }, { transaction: t });

      if (items && Array.isArray(items) && items.length > 0) {
        const itemsData = items.map(item => ({
          pedido_id: pedido.id,
          producto_id: item.id,
          cantidad: item.qty,
          precio_unitario: item.price,
          subtotal: item.price * item.qty
        }));
        const { pedidoitems } = require('../models');
        await pedidoitems.bulkCreate(itemsData, { transaction: t });
      }

      const { facturas } = require('../models');
      const factura = await facturas.create({
        tenant_id: req.tenantId,
        pedido_id: pedido.id,
        numero_factura: `FAC-${pedido.id}-${Date.now()}`,
        subtotal: parseFloat(total),
        impuestos: 0,
        total: parseFloat(total),
        creado_en: new Date()
      }, { transaction: t });

      const { pagos } = require('../models');
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

      const pedidoCompleto = await pedidos.findByPk(pedido.id, {
        include: includeOrderRelations
      });

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
      if (t) await t.rollback();
      console.error('Error creando pedido completo:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  },

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { estado_id } = req.body;

      if (!estado_id) {
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
        return res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Pedido no encontrado'
        });
      }

      await pedido.update({ estado_id });

      const pedidoActualizado = await pedidos.findByPk(pedido.id, {
        include: includeOrderRelations
      });

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
      console.error('Error actualizando pedido:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  },

  async cancelar(req, res) {
    try {
      const { id } = req.params;

      const pedido = await pedidos.findOne({
        where: {
          id,
          tenant_id: req.tenantId
        }
      });

      if (!pedido) {
        return res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Pedido no encontrado'
        });
      }

      const cancelledStatusId = await resolveCancelledStatusId();
      await pedido.update({ estado_id: cancelledStatusId });

      const pedidoCancelado = await pedidos.findByPk(pedido.id, {
        include: includeOrderRelations
      });

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
