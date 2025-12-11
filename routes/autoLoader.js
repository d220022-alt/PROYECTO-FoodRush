const express = require('express');
const db = require('../models');
const GenericController = require('../controllers/GenericController');

// Modelos que YA tienen rutas personalizadas y no queremos sobreescribir
const EXCLUDED_MODELS = [
    'productos',
    'pedidos',
    'usuarios',
    'tenants'
];

/**
 * Función mágica que auto-genera rutas para todos los modelos que faltan.
 * @param {Express.Application} app - La instancia de Express
 */
function setupDynamicRoutes(app) {
    console.log('🚀 Iniciando Auto-Loader de Rutas...');

    const models = Object.keys(db).filter(key => {
        return key !== 'sequelize' && key !== 'Sequelize' && !EXCLUDED_MODELS.includes(key);
    });

    let count = 0;

    models.forEach(modelName => {
        const model = db[modelName];

        // Crear controlador genérico para este modelo
        const controller = new GenericController(model);
        const router = express.Router();

        // Definir las rutas estándar CRUD
        router.get('/', controller.listar);
        router.get('/:id', controller.obtener);
        router.post('/', controller.crear);
        router.put('/:id', controller.actualizar);
        router.delete('/:id', controller.eliminar);

        // Montar la ruta
        // Usamos el nombre del modelo tal cual (ej: 'categorias' -> '/api/categorias')
        const routePath = `/api/${modelName}`;
        app.use(routePath, router);

        console.log(`   ✨ Ruta generada: ${routePath}`);
        count++;
    });

    console.log(`✅ Se generaron ${count} rutas dinámicas automáticamente.`);
}

module.exports = setupDynamicRoutes;
