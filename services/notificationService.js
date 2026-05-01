const { notificaciones, pedidostracking, estadospedidos } = require('../models');
const realtimeHub = require('./realtimeHub');

const STATUS_LABELS = {
  1: 'Pendiente',
  2: 'Preparando',
  3: 'En camino',
  4: 'Entregado',
  5: 'Cancelado'
};

const STATUS_MESSAGES = {
  1: 'Tu pedido fue enviado al local y espera confirmacion.',
  2: 'El local confirmo tu pedido y ya lo esta preparando.',
  3: 'Tu repartidor ya va camino a tu direccion.',
  4: 'Tu pedido fue marcado como entregado.',
  5: 'Tu pedido fue cancelado.'
};

const toPlain = (value) => {
  if (!value) return null;
  if (typeof value.toJSON === 'function') return value.toJSON();
  return value;
};

const resolveStatusLabel = async (statusId) => {
  const parsedStatusId = Number.parseInt(statusId, 10);
  if (!Number.isFinite(parsedStatusId)) return STATUS_LABELS[1];

  try {
    const status = await estadospedidos.findByPk(parsedStatusId);
    return status?.descripcion || status?.codigo || STATUS_LABELS[parsedStatusId] || 'Actualizado';
  } catch {
    return STATUS_LABELS[parsedStatusId] || 'Actualizado';
  }
};

const normalizeNotification = (notification) => {
  const raw = toPlain(notification);
  if (!raw) return null;

  const payload = raw.payload || {};
  return {
    id: raw.id,
    type: payload.type || raw.tipo || 'system',
    title: payload.title || 'FoodRush',
    message: payload.message || '',
    icon: payload.icon || 'fa-regular fa-bell',
    route: payload.route || '',
    read: false,
    created_at: raw.creado_en,
    order_id: payload.order_id || payload.orderId || null,
    tenant_id: raw.tenant_id,
    payload
  };
};

const createNotification = async ({
  tenantId,
  type = 'system',
  title = 'FoodRush',
  message = '',
  icon = 'fa-regular fa-bell',
  route = '',
  orderId = null,
  audience = 'tenant',
  destino = {},
  payload = {}
}) => {
  try {
    const notification = await notificaciones.create({
      tenant_id: tenantId,
      tipo: type,
      destino: {
        audience,
        order_id: orderId,
        ...destino
      },
      payload: {
        type,
        title,
        message,
        icon,
        route,
        order_id: orderId,
        ...payload
      },
      enviado: false,
      creado_en: new Date()
    });

    const normalized = normalizeNotification(notification);
    realtimeHub.publish(tenantId, 'notification-created', normalized);
    return normalized;
  } catch (error) {
    console.error('No se pudo crear notificacion:', error.message);
    return null;
  }
};

const recordOrderTracking = async ({ pedidoId, statusId, note = '' }) => {
  try {
    if (!pedidoId || !statusId) return null;
    return await pedidostracking.create({
      pedido_id: pedidoId,
      estado_id: statusId,
      nota: note,
      creado_en: new Date()
    });
  } catch (error) {
    console.error('No se pudo registrar tracking de pedido:', error.message);
    return null;
  }
};

const notifyOrderStatus = async ({ tenantId, order, statusId, event = 'order-updated', note = '' }) => {
  const plainOrder = toPlain(order) || {};
  const orderId = plainOrder.id;
  const label = await resolveStatusLabel(statusId || plainOrder.estado_id);

  await recordOrderTracking({
    pedidoId: orderId,
    statusId: statusId || plainOrder.estado_id,
    note: note || label
  });

  const notification = await createNotification({
    tenantId,
    type: 'order',
    title: `Pedido #${orderId} ${label}`,
    message: STATUS_MESSAGES[statusId] || `Estado actual: ${label}.`,
    icon: label.toLowerCase().includes('camino') ? 'fa-solid fa-motorcycle' : 'fa-solid fa-receipt',
    route: `/tracking/${orderId}?tenant=${tenantId}`,
    orderId,
    audience: 'order',
    destino: {
      cliente_id: plainOrder.cliente_id || null
    },
    payload: {
      status_id: statusId || plainOrder.estado_id,
      status_label: label
    }
  });

  realtimeHub.publish(tenantId, event, {
    order_id: orderId,
    status_id: statusId || plainOrder.estado_id,
    status_label: label,
    notification
  });

  return notification;
};

module.exports = {
  createNotification,
  normalizeNotification,
  notifyOrderStatus,
  recordOrderTracking,
  resolveStatusLabel
};
