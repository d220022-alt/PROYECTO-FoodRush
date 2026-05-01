const { Op } = require('sequelize');
const {
  pedidos,
  repartidores,
  repartidorasignaciones,
  repartidortracking
} = require('../models');
const realtimeHub = require('../services/realtimeHub');
const { createNotification } = require('../services/notificationService');

const HEARTBEAT_MS = 25000;

const toNumber = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const safeString = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  const normalized = String(value).trim();
  return normalized || fallback;
};

const resolveDriver = async ({ tenantId, driverName, driverEmail, driverPhone }) => {
  const normalizedEmail = safeString(driverEmail).toLowerCase();
  const normalizedPhone = safeString(driverPhone || normalizedEmail);
  const normalizedName = safeString(driverName, normalizedEmail || 'Repartidor FoodRush');

  const where = {
    tenant_id: tenantId,
    [Op.or]: [
      { telefono: normalizedPhone },
      { nombre: normalizedName }
    ]
  };

  const existing = await repartidores.findOne({ where });
  if (existing) return existing;

  return repartidores.create({
    tenant_id: tenantId,
    nombre: normalizedName,
    telefono: normalizedPhone,
    activo: true,
    creado_en: new Date()
  });
};

const buildAssignmentPayload = (assignment, driver, extra = {}) => ({
  id: assignment?.id || null,
  orderId: safeString(assignment?.pedido_id || extra.orderId),
  pedido_id: assignment?.pedido_id || extra.orderId || null,
  tenantId: safeString(extra.tenantId),
  tenant_id: extra.tenantId || null,
  driverId: assignment?.repartidor_id || driver?.id || null,
  repartidor_id: assignment?.repartidor_id || driver?.id || null,
  driverName: safeString(driver?.nombre || extra.driverName, 'Repartidor FoodRush'),
  repartidor_nombre: safeString(driver?.nombre || extra.driverName, 'Repartidor FoodRush'),
  driverEmail: safeString(driver?.telefono || extra.driverEmail).toLowerCase(),
  repartidor_email: safeString(driver?.telefono || extra.driverEmail).toLowerCase(),
  status: safeString(assignment?.estado || extra.status, 'accepted'),
  stage: safeString(extra.stage || assignment?.estado, 'accepted'),
  assignedAt: assignment?.asignado_en || extra.assignedAt || new Date().toISOString(),
  updatedAt: extra.updatedAt || new Date().toISOString()
});

const realtimeController = {
  stream(req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no'
    });

    const unsubscribe = realtimeHub.subscribe(req.tenantId, res);
    const heartbeat = setInterval(() => {
      res.write(': heartbeat\n\n');
    }, HEARTBEAT_MS);

    req.on('close', () => {
      clearInterval(heartbeat);
      unsubscribe();
    });
  },

  async listAssignments(req, res) {
    try {
      const tenantOrders = await pedidos.findAll({
        where: { tenant_id: req.tenantId },
        attributes: ['id', 'tenant_id']
      });
      const orderIds = tenantOrders.map((order) => order.id);

      if (orderIds.length === 0) {
        return res.json({ success: true, data: [] });
      }

      const assignments = await repartidorasignaciones.findAll({
        where: { pedido_id: { [Op.in]: orderIds } },
        order: [['asignado_en', 'DESC']]
      });
      const driverIds = [...new Set(assignments.map((assignment) => assignment.repartidor_id).filter(Boolean))];
      const drivers = driverIds.length
        ? await repartidores.findAll({ where: { id: { [Op.in]: driverIds } } })
        : [];
      const driversById = new Map(drivers.map((driver) => [String(driver.id), driver]));

      const latestAssignments = [];
      const seenOrders = new Set();
      assignments.forEach((assignment) => {
        const key = String(assignment.pedido_id);
        if (seenOrders.has(key)) return;
        seenOrders.add(key);
        latestAssignments.push(assignment);
      });

      res.json({
        success: true,
        data: latestAssignments.map((assignment) =>
          buildAssignmentPayload(assignment, driversById.get(String(assignment.repartidor_id)), {
            tenantId: req.tenantId
          })
        )
      });
    } catch (error) {
      console.error('Error listando asignaciones delivery:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  },

  async upsertAssignment(req, res) {
    try {
      const orderId = req.body.pedido_id || req.body.orderId || req.body.order_id;
      const status = safeString(req.body.status || req.body.estado, 'accepted');
      const stage = safeString(req.body.stage, status);

      if (!orderId) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Se requiere el pedido para asignar delivery.'
        });
      }

      const order = await pedidos.findOne({
        where: {
          id: orderId,
          tenant_id: req.tenantId
        }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Pedido no encontrado para este tenant.'
        });
      }

      const driver = await resolveDriver({
        tenantId: req.tenantId,
        driverName: req.body.driverName || req.body.repartidor_nombre || req.user?.nombre,
        driverEmail: req.body.driverEmail || req.body.repartidor_email || req.user?.correo,
        driverPhone: req.body.driverPhone || req.body.telefono
      });

      const existing = await repartidorasignaciones.findOne({
        where: { pedido_id: order.id },
        order: [['asignado_en', 'DESC']]
      });

      const assignment = existing
        ? await existing.update({ repartidor_id: driver.id, estado: status })
        : await repartidorasignaciones.create({
            pedido_id: order.id,
            repartidor_id: driver.id,
            estado: status,
            asignado_en: new Date()
          });

      const payload = buildAssignmentPayload(assignment, driver, {
        tenantId: req.tenantId,
        orderId: order.id,
        status,
        stage,
        driverName: driver.nombre,
        driverEmail: driver.telefono
      });

      await createNotification({
        tenantId: req.tenantId,
        type: 'delivery',
        title: `Delivery actualizado #${order.id}`,
        message: `${payload.driverName} marco el pedido como ${stage}.`,
        icon: 'fa-solid fa-motorcycle',
        route: `/tracking/${order.id}?tenant=${req.tenantId}`,
        orderId: order.id,
        audience: 'order',
        payload: {
          assignment: payload
        }
      });

      realtimeHub.publish(req.tenantId, 'delivery-assigned', {
        order_id: order.id,
        assignment: payload
      });

      res.status(existing ? 200 : 201).json({
        success: true,
        data: payload
      });
    } catch (error) {
      console.error('Error asignando delivery:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  },

  async recordLocation(req, res) {
    try {
      const orderId = req.body.pedido_id || req.body.orderId || req.body.order_id;
      const lat = toNumber(req.body.lat);
      const lon = toNumber(req.body.lon ?? req.body.lng);
      const driverId = req.body.repartidor_id || req.body.driverId || null;

      if (!orderId || lat === null || lon === null) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Se requiere pedido, latitud y longitud.'
        });
      }

      const order = await pedidos.findOne({
        where: {
          id: orderId,
          tenant_id: req.tenantId
        }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Pedido no encontrado para este tenant.'
        });
      }

      let tracking = null;
      if (driverId) {
        const driver = await repartidores.findByPk(driverId);
        if (driver) {
          tracking = await repartidortracking.create({
            repartidor_id: driver.id,
            lat,
            lon,
            registrado_en: new Date()
          });
        }
      }

      const payload = {
        id: tracking?.id || null,
        order_id: safeString(order.id),
        pedido_id: order.id,
        repartidor_id: driverId,
        lat,
        lng: lon,
        lon,
        stage: safeString(req.body.stage, ''),
        recorded_at: new Date().toISOString()
      };

      realtimeHub.publish(req.tenantId, 'driver-location', payload);

      res.status(201).json({
        success: true,
        data: payload
      });
    } catch (error) {
      console.error('Error registrando ubicacion delivery:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  }
};

module.exports = realtimeController;
