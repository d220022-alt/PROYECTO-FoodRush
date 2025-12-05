// routes/orders.js
const express = require('express');
const router = express.Router();

const OrderController = require('../controllers/OrderController');

// Crear pedido
router.post('/', OrderController.createOrder);

// Traer pedido con items
router.get('/:id', OrderController.getOrderById);

module.exports = router;
