const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// GET /api/productos - Listar productos
router.get('/', productoController.listar);

// GET /api/productos/:id - Obtener un producto
router.get('/:id', productoController.obtener);

// POST /api/productos - Crear producto
router.post('/', productoController.crear);

// PUT /api/productos/:id - Actualizar producto
router.put('/:id', productoController.actualizar);

// DELETE /api/productos/:id - Eliminar (desactivar) producto
router.delete('/:id', productoController.eliminar);

// POST /api/productos/:id/variantes - Agregar variante
router.post('/:id/variantes', productoController.agregarVariante);

// PATCH /api/productos/:id/toggle - Alternar activo/inactivo
router.patch('/:id/toggle', productoController.toggleActivo);

module.exports = router;