const { Op } = require('sequelize');
const { notificaciones } = require('../models');
const { normalizeNotification } = require('../services/notificationService');

const toInteger = (value, fallback = 0) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const notificacionController = {
  async listar(req, res) {
    try {
      const limit = Math.min(Math.max(toInteger(req.query.limit, 30), 1), 100);
      const whereClause = {
        tenant_id: req.tenantId
      };

      if (req.query.pedido_id || req.query.order_id) {
        const orderId = String(req.query.pedido_id || req.query.order_id);
        whereClause.payload = {
          [Op.contains]: {
            order_id: orderId
          }
        };
      }

      const rows = await notificaciones.findAll({
        where: whereClause,
        order: [['creado_en', 'DESC']],
        limit
      });

      res.json({
        success: true,
        data: rows.map(normalizeNotification).filter(Boolean)
      });
    } catch (error) {
      console.error('Error listando notificaciones:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  }
};

module.exports = notificacionController;
