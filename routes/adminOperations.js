const express = require('express');
const { Op } = require('sequelize');
const db = require('../models');

const router = express.Router();

const ZONE_KIND = 'admin_operation_zone';
const CLOSURE_ENTITY = 'admin_operation_closure';
const AUDIT_ENTITY = 'admin_operation_audit';
const MAX_CLOSURES = 60;
const MAX_AUDIT = 120;

const DEFAULT_OPERATION_ZONES = [
  {
    id: 'gurabo',
    name: 'Gurabo',
    center: { lat: 19.4876, lng: -70.6727 },
    radiusKm: 3.2,
    deliveryFee: 50,
    etaMin: 24,
    priority: 'Alta',
    active: true,
    color: '#f97316',
    keywords: ['gurabo'],
    notes: 'Zona con alta demanda y rutas rapidas hacia el centro.',
  },
  {
    id: 'villa-olga',
    name: 'Villa Olga',
    center: { lat: 19.4595, lng: -70.6819 },
    radiusKm: 2.4,
    deliveryFee: 45,
    etaMin: 18,
    priority: 'Alta',
    active: true,
    color: '#0f766e',
    keywords: ['villa olga'],
    notes: 'Zona prioritaria por cercania a varias franquicias.',
  },
  {
    id: 'pekin',
    name: 'Pekin',
    center: { lat: 19.4214, lng: -70.7045 },
    radiusKm: 3.6,
    deliveryFee: 60,
    etaMin: 32,
    priority: 'Media',
    active: true,
    color: '#2563eb',
    keywords: ['pekin'],
    notes: 'Cobertura sur con ETA mayor por distancia.',
  },
  {
    id: 'santiago-centro',
    name: 'Santiago Centro',
    center: { lat: 19.4517, lng: -70.697 },
    radiusKm: 2.8,
    deliveryFee: 40,
    etaMin: 20,
    priority: 'Media',
    active: true,
    color: '#7c3aed',
    keywords: ['santiago', 'centro', 'monumental'],
    notes: 'Cobertura base cuando la direccion no cae en otra zona.',
  },
];

const safeText = (value, fallback = '') => String(value || fallback || '').trim();
const toFiniteNumber = (value, fallback, min = null) => {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return fallback;
  return min === null ? parsed : Math.max(min, parsed);
};
const toFiniteInteger = (value, fallback, min = null) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return min === null ? parsed : Math.max(min, parsed);
};

const parseJson = (value, fallback = {}) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const stringifyDetails = (value) => JSON.stringify(value);

const buildRouteDescription = (zone) => stringifyDetails({
  kind: ZONE_KIND,
  zone,
  updatedAt: new Date().toISOString(),
});

const normalizeZone = (zone = {}, index = 0) => {
  const fallback = DEFAULT_OPERATION_ZONES[index] || DEFAULT_OPERATION_ZONES[0];
  const center = zone.center || {};

  return {
    ...fallback,
    ...zone,
    id: safeText(zone.id, fallback.id).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, ''),
    name: safeText(zone.name, fallback.name),
    center: {
      lat: toFiniteNumber(center.lat, fallback.center.lat),
      lng: toFiniteNumber(center.lng, fallback.center.lng),
    },
    radiusKm: toFiniteNumber(zone.radiusKm, fallback.radiusKm, 0.5),
    deliveryFee: toFiniteNumber(zone.deliveryFee, fallback.deliveryFee, 0),
    etaMin: toFiniteInteger(zone.etaMin, fallback.etaMin, 5),
    priority: safeText(zone.priority, fallback.priority),
    active: zone.active !== false,
    color: safeText(zone.color, fallback.color),
    keywords: Array.isArray(zone.keywords)
      ? zone.keywords.map((item) => safeText(item)).filter(Boolean)
      : fallback.keywords,
    notes: safeText(zone.notes, fallback.notes),
    updatedAt: safeText(zone.updatedAt, new Date().toISOString()),
  };
};

const serializeZoneRow = (row, index = 0) => {
  const payload = parseJson(row.descripcion, {});
  const zone = normalizeZone(payload.zone || payload, index);
  return {
    ...zone,
    routeId: String(row.id),
    createdAt: row.creado_en || zone.createdAt || '',
  };
};

const getZoneRows = async (tenantId) => db.rutas.findAll({
  where: {
    tenant_id: tenantId,
    descripcion: { [Op.like]: `%"kind":"${ZONE_KIND}"%` },
  },
  order: [['id', 'ASC']],
});

const ensureDefaultZones = async (tenantId) => {
  const existingRows = await getZoneRows(tenantId);
  if (existingRows.length > 0) {
    return existingRows;
  }

  await db.rutas.bulkCreate(DEFAULT_OPERATION_ZONES.map((zone, index) => {
    const normalized = normalizeZone({ ...zone, updatedAt: new Date().toISOString() }, index);
    return {
      tenant_id: tenantId,
      descripcion: buildRouteDescription(normalized),
    };
  }));

  return getZoneRows(tenantId);
};

const getZones = async (tenantId) => {
  const rows = await ensureDefaultZones(tenantId);
  return rows.map(serializeZoneRow);
};

const normalizeAuditEntry = (entry = {}) => ({
  id: safeText(entry.id, `audit-${Date.now()}`),
  action: safeText(entry.action, entry.accion || 'Accion registrada'),
  detail: safeText(entry.detail, entry.detalle || entry.detalles || 'Sin detalle'),
  tenantId: safeText(entry.tenantId),
  tenantName: safeText(entry.tenantName, 'Vista Global'),
  tone: safeText(entry.tone, 'info'),
  userName: safeText(entry.userName, 'Admin FoodRush'),
  userEmail: safeText(entry.userEmail),
  createdAt: safeText(entry.createdAt, new Date().toISOString()),
  metadata: entry.metadata && typeof entry.metadata === 'object' ? entry.metadata : {},
});

const serializeAuditRow = (row) => {
  const payload = parseJson(row.detalles, {});
  const entry = normalizeAuditEntry(payload.entry || payload);
  return {
    ...entry,
    id: safeText(entry.id, `auditlog-${row.id}`),
    action: safeText(entry.action, row.accion),
    createdAt: row.creado_en || entry.createdAt,
  };
};

const normalizeClosureRecord = (record = {}) => ({
  id: safeText(record.id, `closure-${Date.now()}`),
  dateKey: safeText(record.dateKey, new Date().toISOString().slice(0, 10)),
  tenantId: safeText(record.tenantId, 'Global'),
  tenantName: safeText(record.tenantName, 'Vista Global'),
  totalOrders: toFiniteInteger(record.totalOrders, 0, 0),
  deliveredOrders: toFiniteInteger(record.deliveredOrders, 0, 0),
  cancelledOrders: toFiniteInteger(record.cancelledOrders, 0, 0),
  activeOrders: toFiniteInteger(record.activeOrders, 0, 0),
  assignedOrders: toFiniteInteger(record.assignedOrders, 0, 0),
  grossSales: toFiniteNumber(record.grossSales, 0, 0),
  averageTicket: toFiniteNumber(record.averageTicket, 0, 0),
  activeZones: toFiniteInteger(record.activeZones, 0, 0),
  generatedAt: safeText(record.generatedAt, new Date().toISOString()),
});

const serializeClosureRow = (row) => {
  const payload = parseJson(row.detalles, {});
  return normalizeClosureRecord(payload.record || payload);
};

const createAuditLog = async (tenantId, userId, entry, entity = AUDIT_ENTITY) => {
  const normalized = normalizeAuditEntry(entry);
  const row = await db.auditlogs.create({
    tenant_id: tenantId,
    usuario_id: userId || null,
    accion: normalized.action,
    entidad: entity,
    entidad_id: normalized.id,
    detalles: stringifyDetails({ entry: normalized }),
  });

  return serializeAuditRow(row);
};

router.get('/state', async (req, res) => {
  try {
    const [zones, closureRows, auditRows] = await Promise.all([
      getZones(req.tenantId),
      db.auditlogs.findAll({
        where: { tenant_id: req.tenantId, entidad: CLOSURE_ENTITY },
        order: [['id', 'DESC']],
        limit: MAX_CLOSURES,
      }),
      db.auditlogs.findAll({
        where: { tenant_id: req.tenantId, entidad: AUDIT_ENTITY },
        order: [['id', 'DESC']],
        limit: MAX_AUDIT,
      }),
    ]);

    res.json({
      success: true,
      data: {
        zones,
        closures: closureRows.map(serializeClosureRow),
        audit: auditRows.map(serializeAuditRow),
      },
    });
  } catch (error) {
    console.error('Error cargando operaciones admin:', error);
    res.status(500).json({
      success: false,
      error: 'ADMIN_OPERATIONS_STATE_ERROR',
      message: 'No se pudo cargar la operacion administrativa.',
    });
  }
});

router.get('/zones', async (req, res) => {
  try {
    const zones = await getZones(req.tenantId);
    res.json({ success: true, data: zones, count: zones.length });
  } catch (error) {
    console.error('Error cargando zonas admin:', error);
    res.status(500).json({
      success: false,
      error: 'ADMIN_ZONES_ERROR',
      message: 'No se pudieron cargar las zonas operativas.',
    });
  }
});

router.put('/zones/:id', async (req, res) => {
  try {
    const requestedId = safeText(req.params.id);
    const normalized = normalizeZone({ ...req.body, id: requestedId || req.body?.id });
    const rows = await getZoneRows(req.tenantId);
    const existing = rows.find((row, index) => serializeZoneRow(row, index).id === normalized.id);

    let row;
    if (existing) {
      await existing.update({ descripcion: buildRouteDescription(normalized) });
      row = existing;
    } else {
      row = await db.rutas.create({
        tenant_id: req.tenantId,
        descripcion: buildRouteDescription(normalized),
      });
    }

    const saved = serializeZoneRow(row);
    await createAuditLog(req.tenantId, req.user?.id, {
      action: 'Zona actualizada',
      detail: `${saved.name}: ${saved.radiusKm} km, envio $${Number(saved.deliveryFee || 0).toFixed(2)}, ETA ${saved.etaMin} min.`,
      tenantId: safeText(req.body?.tenantId),
      tenantName: safeText(req.body?.tenantName, 'Vista Global'),
      tone: 'info',
      metadata: { zoneId: saved.id, routeId: saved.routeId },
    });

    res.json({ success: true, data: saved });
  } catch (error) {
    console.error('Error guardando zona admin:', error);
    res.status(400).json({
      success: false,
      error: 'ADMIN_ZONE_SAVE_ERROR',
      message: error.message || 'No se pudo guardar la zona operativa.',
    });
  }
});

router.get('/closures', async (req, res) => {
  try {
    const rows = await db.auditlogs.findAll({
      where: { tenant_id: req.tenantId, entidad: CLOSURE_ENTITY },
      order: [['id', 'DESC']],
      limit: MAX_CLOSURES,
    });
    const closures = rows.map(serializeClosureRow);
    res.json({ success: true, data: closures, count: closures.length });
  } catch (error) {
    console.error('Error cargando cierres admin:', error);
    res.status(500).json({
      success: false,
      error: 'ADMIN_CLOSURES_ERROR',
      message: 'No se pudieron cargar los cierres operativos.',
    });
  }
});

router.post('/closures', async (req, res) => {
  try {
    const record = normalizeClosureRecord(req.body);
    const row = await db.auditlogs.create({
      tenant_id: req.tenantId,
      usuario_id: req.user?.id || null,
      accion: 'Cierre operativo',
      entidad: CLOSURE_ENTITY,
      entidad_id: record.id,
      detalles: stringifyDetails({ record }),
    });

    await createAuditLog(req.tenantId, req.user?.id, {
      action: 'Cierre operativo',
      detail: `${record.tenantName}: $${Number(record.grossSales || 0).toFixed(2)} en ${record.deliveredOrders} pedidos entregados.`,
      tenantId: record.tenantId === 'Global' ? '' : record.tenantId,
      tenantName: record.tenantName,
      tone: 'success',
      metadata: { closureId: record.id, auditlogId: row.id },
    });

    res.status(201).json({ success: true, data: serializeClosureRow(row) });
  } catch (error) {
    console.error('Error guardando cierre admin:', error);
    res.status(400).json({
      success: false,
      error: 'ADMIN_CLOSURE_SAVE_ERROR',
      message: error.message || 'No se pudo generar el cierre operativo.',
    });
  }
});

router.get('/audit', async (req, res) => {
  try {
    const rows = await db.auditlogs.findAll({
      where: { tenant_id: req.tenantId, entidad: AUDIT_ENTITY },
      order: [['id', 'DESC']],
      limit: MAX_AUDIT,
    });
    const entries = rows.map(serializeAuditRow);
    res.json({ success: true, data: entries, count: entries.length });
  } catch (error) {
    console.error('Error cargando auditoria admin:', error);
    res.status(500).json({
      success: false,
      error: 'ADMIN_AUDIT_ERROR',
      message: 'No se pudo cargar la auditoria administrativa.',
    });
  }
});

router.post('/audit', async (req, res) => {
  try {
    const entry = await createAuditLog(req.tenantId, req.user?.id, req.body);
    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    console.error('Error guardando auditoria admin:', error);
    res.status(400).json({
      success: false,
      error: 'ADMIN_AUDIT_SAVE_ERROR',
      message: error.message || 'No se pudo registrar la auditoria administrativa.',
    });
  }
});

module.exports = router;
