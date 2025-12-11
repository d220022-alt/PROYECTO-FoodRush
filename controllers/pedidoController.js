const { pedidos } = require('../models');

const pedidoController = {
  
  // GET /api/pedidos - Listar pedidos
  async listar(req, res) {
    try {
      console.log('🔍 Listando pedidos para tenant:', req.tenantId);
      
      const whereClause = {
        tenant_id: req.tenantId
      };
      
      const data = await pedidos.findAll({
        where: whereClause,
        attributes: ['id', 'estado', 'total', 'creado_en'],
        order: [['creado_en', 'DESC']],
        limit: 20
      });
      
      res.json({
        success: true,
        data: data,
        message: data.length === 0 ? 'No hay pedidos para este tenant' : 'Pedidos encontrados'
      });
      
    } catch (error) {
      console.error('❌ Error listando pedidos:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  },
  
  // GET /api/pedidos/:id - Obtener un pedido
  async obtener(req, res) {
    try {
      const { id } = req.params;
      
      const pedido = await pedidos.findOne({
        where: {
          id: id,
          tenant_id: req.tenantId
        }
      });
      
      if (!pedido) {
        return res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Pedido no encontrado'
        });
      }
      
      res.json({
        success: true,
        data: pedido
      });
      
    } catch (error) {
      console.error('Error obteniendo pedido:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  },
  
  // POST /api/pedidos - Crear pedido
  async crear(req, res) {
    try {
      const { cliente_id, total, direccion_entrega, notas } = req.body;
      
      if (!cliente_id || !total) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Cliente y total son requeridos'
        });
      }
      
      const pedido = await pedidos.create({
        tenant_id: req.tenantId,
        cliente_id,
        estado: 'pendiente',
        total: parseFloat(total),
        direccion_entrega: direccion_entrega || '',
        notas: notas || '',
        creado_en: new Date()
      });
      
      res.status(201).json({
        success: true,
        message: 'Pedido creado exitosamente',
        data: pedido
      });
      
    } catch (error) {
      console.error('Error creando pedido:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  },
  
  // PUT /api/pedidos/:id - Actualizar pedido
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      
      const pedido = await pedidos.findOne({
        where: {
          id: id,
          tenant_id: req.tenantId
        }
      });
      
      if (!pedido) {
        return res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Pedido no encontrado'
        });
      }
      
      await pedido.update({ estado });
      
      res.json({
        success: true,
        message: 'Pedido actualizado exitosamente',
        data: pedido
      });
      
    } catch (error) {
      console.error('Error actualizando pedido:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  },
  
  // DELETE /api/pedidos/:id - Cancelar pedido
  async cancelar(req, res) {
    try {
      const { id } = req.params;
      
      const pedido = await pedidos.findOne({
        where: {
          id: id,
          tenant_id: req.tenantId
        }
      });
      
      if (!pedido) {
        return res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Pedido no encontrado'
        });
      }
      
      await pedido.update({ estado: 'cancelado' });
      
      res.json({
        success: true,
        message: 'Pedido cancelado exitosamente'
      });
      
    } catch (error) {
      console.error('Error cancelando pedido:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  }
};

module.exports = pedidoController;