/*
  Guia rapida para presentar:
  Rutas de franquicias. Permiten listar tenants publicos y administrar datos protegidos.
  Buscar en VS Code: backend, Express, Sequelize, FoodRush, presentacion.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const express = require('express');
const TenantController = require('../controllers/TenantController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', TenantController.getAll);
router.get('/:id', TenantController.getById);

router.use(authMiddleware);

router.post('/', TenantController.create);
router.put('/:id', TenantController.update);
router.delete('/:id', TenantController.delete);

module.exports = router;
