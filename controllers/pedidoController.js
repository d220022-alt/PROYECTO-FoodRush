// controllers/pedidoController.js - Controladores de pedidos (A.K.A. La máquina de hacer dinero)
const { pedidos, estadospedidos, clientes } = require('../models');

const pedidoController = {

  async listar(req, res) {
    try {
      console.log('🔍 Listando pedidos para tenant:', req.tenantId);

      const whereClause = {
        tenant_id: req.tenantId
      };

      const data = await pedidos.findAll({
        where: whereClause,
        include: [
          {
            model: estadospedidos,
            as: 'estado',
            attributes: ['id', 'codigo', 'descripcion']
          },
          {
            model: clientes,
            as: 'cliente',
            attributes: ['id', 'nombre', 'telefono']
          }
        ],
        order: [['creado_en', 'DESC']],
        limit: 20
      });

      res.json({
        success: true,
        data: data,
        message: data.length === 0 ? 'No hay pedidos para este tenant' : 'Pedidos encontrados'
      });

    } catch (error) {
      console.error('❌ Error listando pedidos:', error);
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
          id: id,
          tenant_id: req.tenantId
        },
        include: [
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
        ]
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
        return res.status(400).json({ success: false, error: 'VALIDATION_ERROR', message: 'Cliente y total requeridos' });
      }

      // 1. Crear Pedido
      const pedido = await pedidos.create({
        tenant_id: req.tenantId,
        cliente_id,
        estado_id,
        total: parseFloat(total),
        direccion_entrega: direccion_entrega || '',
        notas: notas || '',
        creado_en: new Date()
      }, { transaction: t });

      // 2. Crear Pedido Items
      if (items && Array.isArray(items) && items.length > 0) {
        const itemsData = items.map(item => ({
          pedido_id: pedido.id,
          producto_id: item.id,
          cantidad: item.qty,
          precio_unitario: item.price,
          subtotal: item.price * item.qty
        }));
        // Necesitamos el modelo pedidoitems importado al inicio
        // Nota: Asegurarse que el controller importe 'pedidoitems'
        const { pedidoitems } = require('../models');
        await pedidoitems.bulkCreate(itemsData, { transaction: t });
      }

      // 3. Crear Factura (Simplificada)
      const { facturas } = require('../models');
      const factura = await facturas.create({
        tenant_id: req.tenantId,
        pedido_id: pedido.id,
        numero_factura: `FAC-${pedido.id}-${Date.now()}`,
        subtotal: parseFloat(total), // Simplificación: asumiendo impuestos incluidos o 0
        impuestos: 0,
        total: parseFloat(total),
        creado_en: new Date()
      }, { transaction: t });

      // 4. Crear Pago
      const { pagos } = require('../models');
      // Mapeo simple de método de pago (si viniera string 'card', 'cash') a IDs o dejar null si no coinciden
      // Asumimos 1: Efectivo, 2: Tarjeta por defecto si no hay tabla real poblada
      let metodoId = null;
      if (metodo_pago === 'cash') metodoId = 1;
      if (metodo_pago === 'card') metodoId = 2;
      if (metodo_pago === 'paypal') metodoId = 3;

      await pagos.create({
        pedido_id: pedido.id,
        factura_id: factura.id,
        metodo_id: metodoId, // Puede ser null si la FK lo permite (allowNull: true en modelo)
        monto: parseFloat(total),
        referencia: metodo_pago === 'cash' ? 'Pago en entrega' : 'Simulación',
        estado: 'Aprobado', // Asumimos aprobado para la demo
        creado_en: new Date()
      }, { transaction: t });

      await t.commit();

      // Respuesta
      const pedidoCompleto = await pedidos.findByPk(pedido.id, {
        include: [{ model: estadospedidos, as: 'estado', attributes: ['id', 'codigo', 'descripcion'] }]
      });

      res.status(201).json({
        success: true,
        message: 'Pedido, items, factura y pago creados exitosamente',
        data: pedidoCompleto
      });

    } catch (error) {
      if (t) await t.rollback();
      console.error('Error creando pedido completo:', error);
      res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { estado_id } = req.body; // Ahora sí, el estado_id nuevo

      const pedido = await pedidos.findOne({
        where: {
          id: id,
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

      await pedido.update({ estado_id }); // Actualizamos el estado, y a otra cosa mariposa

      res.json({
        success: true,
        message: 'Pedido actualizado exitosamente',
        data: pedido
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
          id: id,
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

      // Actualizar estado_id a cancelado (le ponemos el 3 o el que sea de cancelado)
      await pedido.update({ estado_id: 3 }); // Adiós pedido, que la fuerza te acompañe

      res.json({
        success: true,
        message: 'Pedido cancelado exitosamente'
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