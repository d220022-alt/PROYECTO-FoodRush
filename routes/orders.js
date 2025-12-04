// routes/orders.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Create order (simplificado: items array {variant_id, cantidad})
router.post('/', async (req, res) => {
  const { tenant_id, sucursal_id, cliente_id, usuario_id, items } = req.body;
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const orderRes = await client.query(
      `INSERT INTO pedidos (tenant_id,sucursal_id,cliente_id,usuario_id,total,estado) VALUES ($1,$2,$3,$4,0,'pending') RETURNING *`,
      [tenant_id, sucursal_id, cliente_id, usuario_id]
    );
    const orderId = orderRes.rows[0].id;
    let total = 0;
    for (const it of items) {
      // get price
      const v = await client.query('SELECT precio FROM producto_variantes WHERE id=$1', [it.variant_id]);
      const precio = v.rows[0].precio;
      const subtotal = Number(precio) * Number(it.cantidad);
      total += subtotal;
      await client.query(
        `INSERT INTO pedido_items (pedido_id,variante_id,cantidad,precio_unitario,subtotal) VALUES ($1,$2,$3,$4,$5)`,
        [orderId, it.variant_id, it.cantidad, precio, subtotal]
      );
    }
    await client.query('UPDATE pedidos SET total=$1 WHERE id=$2', [total, orderId]);
    await client.query('COMMIT');
    res.status(201).json({ orderId, total });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'could not create order' });
  } finally {
    client.release();
  }
});

// Get order with items
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const order = await db.query('SELECT * FROM pedidos WHERE id=$1', [id]);
    if (!order.rowCount) return res.status(404).json({ error: 'not found' });
    const items = await db.query('SELECT pi.*, pv.nombre as variante_nombre FROM pedido_items pi JOIN producto_variantes pv ON pi.variante_id = pv.id WHERE pi.pedido_id=$1', [id]);
    res.json({ order: order.rows[0], items: items.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

module.exports = router;
