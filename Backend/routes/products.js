// routes/products.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// List products
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT p.*, c.nombre as categoria FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id ORDER BY p.id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error fetching products' });
  }
});

// Get product with variants
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const prod = await db.query('SELECT * FROM productos WHERE id = $1', [id]);
    if (!prod.rowCount) return res.status(404).json({ error: 'not found' });
    const variants = await db.query('SELECT * FROM producto_variantes WHERE producto_id = $1', [id]);
    res.json({ product: prod.rows[0], variants: variants.rows });
  } catch (err) { res.status(500).json({ error: 'db error' }); }
});

// Create product
router.post('/', async (req, res) => {
  const { tenant_id, categoria_id, nombre, descripcion } = req.body;
  try {
    const q = 'INSERT INTO productos (tenant_id,categoria_id,nombre,descripcion) VALUES ($1,$2,$3,$4) RETURNING *';
    const { rows } = await db.query(q, [tenant_id, categoria_id, nombre, descripcion]);
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: 'create error' }); }
});

module.exports = router;
