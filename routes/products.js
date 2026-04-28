const express = require('express');
const productoController = require('../controllers/productoController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', productoController.listar);
router.get('/:id', productoController.obtener);

router.use(authMiddleware);

router.post('/', productoController.crear);
router.put('/:id', productoController.actualizar);
router.delete('/:id', productoController.eliminar);
router.post('/:id/variantes', productoController.agregarVariante);
router.patch('/:id/toggle', productoController.toggleActivo);

module.exports = router;
