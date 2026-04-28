const express = require('express');
const pedidoController = require('../controllers/pedidoController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', pedidoController.listar);
router.get('/:id', pedidoController.obtener);
router.post('/', pedidoController.crear);
router.put('/:id', pedidoController.actualizar);
router.delete('/:id', pedidoController.cancelar);

module.exports = router;
