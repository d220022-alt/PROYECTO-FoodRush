const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/usuarios - Listar usuarios
router.get('/', userController.listar);

// GET /api/usuarios/:id - Obtener un usuario
router.get('/:id', userController.obtener);

// POST /api/usuarios - Crear usuario
router.post('/', userController.crear);

// PUT /api/usuarios/:id - Actualizar usuario
router.put('/:id', userController.actualizar);

// DELETE /api/usuarios/:id - Desactivar usuario
router.delete('/:id', userController.eliminar);

module.exports = router;
