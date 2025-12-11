// middleware/tenantMiddleware.js
const { tenants } = require('../models');

const tenantMiddleware = async (req, res, next) => {
  try {
    // FORMA 1: Header (para API calls)
    let tenantId = req.headers['x-tenant-id'] || req.headers['tenant-id'];
    
    // FORMA 2: Subdominio (para web) - ej: tenant1.foodrush.com
    if (!tenantId && req.headers.host) {
      const subdomain = req.headers.host.split('.')[0];
      if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
        tenantId = subdomain;
      }
    }
    
    // FORMA 3: Query parameter (para desarrollo/testing)
    if (!tenantId && req.query.tenant_id) {
      tenantId = req.query.tenant_id;
    }
    
    // Si no hay tenantId, ERROR
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'TENANT_REQUIRED',
        message: 'Se requiere identificar el tenant. Usa header X-Tenant-ID o subdominio.'
      });
    }
    
    // Buscar tenant por ID o código
    const whereClause = isNaN(tenantId) 
      ? { codigo: tenantId }
      : { id: parseInt(tenantId) };
    
    const tenant = await tenants.findOne({
      where: whereClause,
      attributes: ['id', 'nombre', 'codigo', 'activo', 'creado_en']
    });
    
    if (!tenant) {
      return res.status(404).json({
        success: false,
        error: 'TENANT_NOT_FOUND',
        message: `Tenant no encontrado: ${tenantId}`
      });
    }
    
    if (!tenant.activo) {
      return res.status(403).json({
        success: false,
        error: 'TENANT_INACTIVE',
        message: 'El tenant está inactivo'
      });
    }
    
    // Adjuntar tenant al request
    req.tenant = tenant;
    req.tenantId = tenant.id;
    
    // MÉTODO MÁGICO: Inyectar tenant_id automáticamente en TODAS las consultas Sequelize
    // Esto sobrescribe los métodos find* de Sequelize para agregar where tenant_id = X
    injectTenantScope(req.tenantId);
    
    console.log(`🔐 Tenant identificado: ${tenant.nombre} (ID: ${tenant.id})`);
    next();
    
  } catch (error) {
    console.error('❌ Error en middleware tenant:', error);
    res.status(500).json({
      success: false,
      error: 'TENANT_MIDDLEWARE_ERROR',
      message: 'Error procesando tenant'
    });
  }
};

// Función para inyectar scope de tenant en modelos
function injectTenantScope(tenantId) {
  const models = require('../models');
  
  Object.values(models).forEach(model => {
    if (model && typeof model === 'object' && model.rawAttributes) {
      // Verificar si el modelo tiene columna tenant_id
      if (model.rawAttributes.tenant_id) {
        // Agregar scope global para este modelo
        model.addScope('defaultScope', {
          where: { tenant_id: tenantId }
        }, { override: true });
      }
    }
  });
}

module.exports = tenantMiddleware;