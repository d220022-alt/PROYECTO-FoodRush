// routes/orders.js - VERSIÓN COMPLETA
const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// GET /api/pedidos - Listar pedidos
router.get('/', pedidoController.listar);

// GET /api/pedidos/:id - Obtener un pedido
router.get('/:id', pedidoController.obtener);

// POST /api/pedidos - Crear pedido
router.post('/', pedidoController.crear);

// PUT /api/pedidos/:id - Actualizar pedido (ahora actualiza estado_id)
router.put('/:id', pedidoController.actualizar);

// DELETE /api/pedidos/:id - Cancelar pedido
router.delete('/:id', pedidoController.cancelar);

module.exports = router;