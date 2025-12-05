// controllers/OrderController.js
const { sequelize } = require('../models');
const { pedidos, pedido_items, producto_variantes } = require('../models');

module.exports = {

  // ============================================================
  // CREATE ORDER
  // ============================================================
  async createOrder(req, res) {
    const { tenant_id, sucursal_id, cliente_id, usuario_id, items } = req.body;

    const t = await sequelize.transaction();

    try {
      // 1. Crear el pedido inicial con total = 0
      const order = await pedidos.create(
        {
          tenant_id,
          sucursal_id,
          cliente_id,
          usuario_id,
          total: 0,
          estado: "pending"
        },
        { transaction: t }
      );

      let total = 0;

      // 2. Procesar cada item
      for (const it of items) {
        // obtener precio de la variante
        const variante = await producto_variantes.findByPk(it.variant_id, { transaction: t });

        if (!variante) {
          throw new Error(`Variant not found: ${it.variant_id}`);
        }

        const subtotal = Number(variante.precio) * Number(it.cantidad);
        total += subtotal;

        // Guardar item
        await pedido_items.create(
          {
            pedido_id: order.id,
            variante_id: it.variant_id,
            cantidad: it.cantidad,
            precio_unitario: variante.precio,
            subtotal
          },
          { transaction: t }
        );
      }

      // 3. Actualizar total del pedido
      await order.update({ total }, { transaction: t });

      await t.commit();

      return res.status(201).json({ orderId: order.id, total });

    } catch (err) {
      await t.rollback();
      console.error(err);
      return res.status(500).json({ error: "could not create order" });
    }
  },

  // ============================================================
  // GET ORDER + ITEMS
  // ============================================================
  async getOrderById(req, res) {
    const id = req.params.id;

    try {
      const order = await pedidos.findByPk(id);

      if (!order) return res.status(404).json({ error: "not found" });

      const items = await pedido_items.findAll({
        where: { pedido_id: id },
        include: [
          {
            model: producto_variantes,
            attributes: ["nombre", "precio"]
          }
        ]
      });

      return res.json({ order, items });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "db error" });
    }
  }

};
