// controllers/pedidoController.js - VERSIÓN CORREGIDA CON estado_id
const { pedidos, estadospedidos, clientes } = require('../models');

const pedidoController = {
  
  async listar(req, res) {
    try {
      console.log('🔍 Listando pedidos para tenant:', req.tenantId);
      
      const whereClause = {
        tenant_id: req.tenantId
      };
      
      const data = await pedidos.findAll({
        where: whereClause,
        include: [
          {
            model: estadospedidos,
            as: 'estado',
            attributes: ['id', 'nombre']
          },
          {
            model: clientes,
            as: 'cliente',
            attributes: ['id', 'nombre', 'telefono']
          }
        ],
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
  
  async obtener(req, res) {
    try {
      const { id } = req.params;
      
      const pedido = await pedidos.findOne({
        where: {
          id: id,
          tenant_id: req.tenantId
        },
        include: [
          {
            model: estadospedidos,
            as: 'estado',
            attributes: ['id', 'nombre', 'descripcion']
          },
          {
            model: clientes,
            as: 'cliente',
            attributes: ['id', 'nombre', 'telefono', 'correo']
          }
        ]
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
  
  async crear(req, res) {
    try {
      const { cliente_id, total, direccion_entrega, notas, estado_id = 1 } = req.body; // estado_id por defecto 1 (pendiente)
      
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
        estado_id, // Usamos estado_id, no estado
        total: parseFloat(total),
        direccion_entrega: direccion_entrega || '',
        notas: notas || '',
        creado_en: new Date()
      });
      
      // Obtener pedido con relaciones
      const pedidoCompleto = await pedidos.findByPk(pedido.id, {
        include: [
          {
            model: estadospedidos,
            as: 'estado',
            attributes: ['id', 'nombre']
          }
        ]
      });
      
      res.status(201).json({
        success: true,
        message: 'Pedido creado exitosamente',
        data: pedidoCompleto
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
  
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { estado_id } = req.body; // Ahora es estado_id
      
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
      
      await pedido.update({ estado_id }); // Actualizar estado_id
      
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
      
      // Actualizar estado_id a cancelado (probablemente estado_id = 3 o similar)
      await pedido.update({ estado_id: 3 }); // Ajusta el ID según tu tabla estadospedidos
      
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