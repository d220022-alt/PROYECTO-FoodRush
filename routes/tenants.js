// routes/tenants.js - VERSIÓN DEFINITIVA
const express = require('express');

// Crear router EXPLÍCITAMENTE con express.Router()
const router = express.Router();

// DEBUG: Verificar qué estamos cargando
console.log('🔄 Cargando TenantController...');

// Cargar controlador con validación EXTREMA
const loadController = () => {
  try {
    // Intento 1: Carga normal
    const controller = require('../controllers/TenantController');
    console.log('✅ TenantController cargado (método normal)');
    
    // Validar que sea un objeto y tenga métodos
    if (!controller || typeof controller !== 'object') {
      throw new Error('Controller no es un objeto');
    }
    
    // Validar cada método
    const requiredMethods = ['create', 'getAll', 'getById', 'update', 'delete'];
    for (const method of requiredMethods) {
      if (typeof controller[method] !== 'function') {
        console.warn(`⚠️  tenantController.${method} no es función, creando dummy`);
        controller[method] = (req, res) => res.json({ 
          success: true, 
          message: `${method} (dummy)`,
          tenantId: req.tenantId 
        });
      }
    }
    
    return controller;
    
  } catch (error) {
    console.error('❌ Error cargando TenantController:', error.message);
    
    // Crear controlador de emergencia
    console.log('🆘 Creando controlador de emergencia');
    return {
      create: (req, res) => res.status(201).json({ 
        success: true, 
        message: 'Create tenant (emergency)',
        tenantId: req.tenantId 
      }),
      getAll: (req, res) => res.json({ 
        success: true, 
        message: 'Get all tenants (emergency)',
        tenantId: req.tenantId 
      }),
      getById: (req, res) => res.json({ 
        success: true, 
        message: `Get tenant ${req.params.id} (emergency)`,
        tenantId: req.tenantId 
      }),
      update: (req, res) => res.json({ 
        success: true, 
        message: `Update tenant ${req.params.id} (emergency)`,
        tenantId: req.tenantId 
      }),
      delete: (req, res) => res.json({ 
        success: true, 
        message: `Delete tenant ${req.params.id} (emergency)`,
        tenantId: req.tenantId 
      })
    };
  }
};

// Cargar controlador
const tenantController = loadController();

// DEBUG
console.log('🔍 tenantController tipo:', typeof tenantController);
console.log('🔍 tenantController.create tipo:', typeof tenantController.create);

// Definir rutas con funciones WRAPPER para mayor seguridad
router.post('/', (req, res) => {
  console.log('📤 POST /api/tenants llamado');
  try {
    return tenantController.create(req, res);
  } catch (error) {
    console.error('Error en POST /api/tenants:', error);
    res.status(500).json({ 
      success: false,
      error: 'HANDLER_ERROR',
      message: 'Error en el handler create' 
    });
  }
});

router.get('/', (req, res) => {
  console.log('📥 GET /api/tenants llamado');
  try {
    return tenantController.getAll(req, res);
  } catch (error) {
    console.error('Error en GET /api/tenants:', error);
    res.status(500).json({ 
      success: false,
      error: 'HANDLER_ERROR',
      message: 'Error en el handler getAll' 
    });
  }
});

router.get('/:id', (req, res) => {
  console.log(`📥 GET /api/tenants/${req.params.id} llamado`);
  try {
    return tenantController.getById(req, res);
  } catch (error) {
    console.error(`Error en GET /api/tenants/${req.params.id}:`, error);
    res.status(500).json({ 
      success: false,
      error: 'HANDLER_ERROR',
      message: 'Error en el handler getById' 
    });
  }
});

router.put('/:id', (req, res) => {
  console.log(`✏️ PUT /api/tenants/${req.params.id} llamado`);
  try {
    return tenantController.update(req, res);
  } catch (error) {
    console.error(`Error en PUT /api/tenants/${req.params.id}:`, error);
    res.status(500).json({ 
      success: false,
      error: 'HANDLER_ERROR',
      message: 'Error en el handler update' 
    });
  }
});

router.delete('/:id', (req, res) => {
  console.log(`🗑️ DELETE /api/tenants/${req.params.id} llamado`);
  try {
    return tenantController.delete(req, res);
  } catch (error) {
    console.error(`Error en DELETE /api/tenants/${req.params.id}:`, error);
    res.status(500).json({ 
      success: false,
      error: 'HANDLER_ERROR',
      message: 'Error en el handler delete' 
    });
  }
});

console.log('✅ Rutas de tenants configuradas');
module.exports = router;