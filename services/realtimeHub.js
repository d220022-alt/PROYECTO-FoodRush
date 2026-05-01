const subscribersByTenant = new Map();

const normalizeTenantId = (tenantId) => String(tenantId || 'global');

const writeEvent = (res, event, payload = {}) => {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
};

const subscribe = (tenantId, res) => {
  const key = normalizeTenantId(tenantId);
  if (!subscribersByTenant.has(key)) {
    subscribersByTenant.set(key, new Set());
  }

  const subscribers = subscribersByTenant.get(key);
  subscribers.add(res);
  writeEvent(res, 'connected', {
    tenant_id: key,
    connected_at: new Date().toISOString()
  });

  return () => {
    subscribers.delete(res);
    if (subscribers.size === 0) {
      subscribersByTenant.delete(key);
    }
  };
};

const publish = (tenantId, event, payload = {}) => {
  const key = normalizeTenantId(tenantId);
  const subscribers = subscribersByTenant.get(key);
  if (!subscribers) return 0;

  let delivered = 0;
  const enrichedPayload = {
    ...payload,
    tenant_id: key,
    emitted_at: new Date().toISOString()
  };

  for (const res of [...subscribers]) {
    try {
      writeEvent(res, event, enrichedPayload);
      delivered += 1;
    } catch {
      subscribers.delete(res);
    }
  }

  return delivered;
};

module.exports = {
  subscribe,
  publish
};
