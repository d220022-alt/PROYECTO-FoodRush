const { tenants } = require('../models');

const tenantMiddleware = async (req, res, next) => {
  try {
    let tenantId = req.tenantId
      || req.headers['x-tenant-id']
      || req.headers['tenant-id']
      || req.query.tenant_id;

    const host = req.headers.host || '';
    if (!tenantId && host && !host.endsWith('.onrender.com')) {
      const subdomain = host.split(':')[0].split('.')[0];
      if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
        tenantId = subdomain;
      }
    }

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'TENANT_REQUIRED',
        message: 'Se requiere identificar el tenant. Usa header X-Tenant-ID o subdominio.'
      });
    }

    const whereClause = Number.isNaN(Number(tenantId))
      ? { codigo: tenantId }
      : { id: Number(tenantId) };

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
        message: 'El tenant esta inactivo'
      });
    }

    req.tenant = tenant;
    req.tenantId = Number(tenant.id);

    next();
  } catch (error) {
    console.error('Error en middleware tenant:', error);
    res.status(500).json({
      success: false,
      error: 'TENANT_MIDDLEWARE_ERROR',
      message: 'Error procesando tenant'
    });
  }
};

module.exports = tenantMiddleware;
