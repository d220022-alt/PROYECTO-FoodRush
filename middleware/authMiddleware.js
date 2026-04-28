const jwt = require('jsonwebtoken');

function getBearerToken(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length).trim();
}

function authMiddleware(req, res, next) {
  const token = getBearerToken(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'AUTH_REQUIRED',
      message: 'Token de autenticacion requerido'
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      success: false,
      error: 'AUTH_CONFIG_ERROR',
      message: 'Autenticacion no configurada'
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const tokenTenantId = payload.tenant_id ? Number(payload.tenant_id) : null;
    const requestTenantId = req.tenantId ? Number(req.tenantId) : null;

    if (tokenTenantId && requestTenantId && tokenTenantId !== requestTenantId) {
      return res.status(403).json({
        success: false,
        error: 'TENANT_MISMATCH',
        message: 'El token no pertenece a este tenant'
      });
    }

    req.user = {
      id: payload.sub,
      tenant_id: tokenTenantId,
      rol_id: payload.rol_id || null
    };

    if (tokenTenantId) {
      req.tenantId = tokenTenantId;
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Token invalido o expirado'
    });
  }
}

module.exports = authMiddleware;
