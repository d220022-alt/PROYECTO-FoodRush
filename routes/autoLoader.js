const express = require('express');
const db = require('../models');
const GenericController = require('../controllers/GenericController');

const EXCLUDED_MODELS = [
  'productos',
  'pedidos',
  'usuarios',
  'tenants'
];

function setupDynamicRoutes(app, middleware = {}) {
  console.log('Iniciando Auto-Loader de Rutas...');

  const routeMiddleware = [
    middleware.authMiddleware,
    middleware.tenantMiddleware
  ].filter(Boolean);

  const models = Object.keys(db).filter(key => {
    return key !== 'sequelize' && key !== 'Sequelize' && !EXCLUDED_MODELS.includes(key);
  });

  let count = 0;

  models.forEach(modelName => {
    const model = db[modelName];
    const controller = new GenericController(model);
    const router = express.Router();

    router.get('/', controller.listar);
    router.get('/:id', controller.obtener);
    router.post('/', controller.crear);
    router.put('/:id', controller.actualizar);
    router.delete('/:id', controller.eliminar);

    const routePath = `/api/${modelName}`;
    app.use(routePath, ...routeMiddleware, router);

    console.log(`Ruta generada: ${routePath}`);
    count++;
  });

  console.log(`Se generaron ${count} rutas dinamicas automaticamente.`);
}

module.exports = setupDynamicRoutes;
