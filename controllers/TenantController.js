// controllers/TenantController.js - VERSIÓN CORREGIDA Y COMPLETA
const { tenants } = require('../models');

const TenantController = {
  
  // POST /api/tenants - Crear un nuevo tenant
  async create(req, res) {
    try {
      const { nombre, codigo, contacto } = req.body;
      
      if (!nombre) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'El nombre es requerido'
        });
      }
      
      // Verificar si el código ya existe
      if (codigo) {
        const existingTenant = await tenants.findOne({ where: { codigo } });
        if (existingTenant) {
          return res.status(400).json({
            success: false,
            error: 'CODE_EXISTS',
            message: 'El código del tenant ya está en uso'
          });
        }
      }
      
      const tenant = await tenants.create({
        nombre,
        codigo: codigo || null,
        contacto: contacto || null,
        activo: true
      });
      
      res.status(201).json({
        success: true,
        message: 'Tenant creado exitosamente',
        data: tenant
      });
      
    } catch (error) {
      console.error('Error creando tenant:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: 'Error al crear tenant'
      });
    }
  },
  
  // GET /api/tenants - Obtener todos los tenants (solo superadmin)
  async getAll(req, res) {
    try {
      const { activo, pagina = 1, limite = 20 } = req.query;
      const offset = (pagina - 1) * limite;
      
      const whereClause = {};
      if (activo !== undefined) whereClause.activo = activo === 'true';
      
      const { count, rows } = await tenants.findAndCountAll({
        where: whereClause,
        limit: parseInt(limite),
        offset: parseInt(offset),
        order: [['creado_en', 'DESC']]
      });
      
      res.json({
        success: true,
        data: rows,
        paginacion: {
          total: count,
          pagina: parseInt(pagina),
          totalPaginas: Math.ceil(count / limite),
          limite: parseInt(limite)
        }
      });
      
    } catch (error) {
      console.error('Error obteniendo tenants:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: 'Error al obtener tenants'
      });
    }
  },
  
  // GET /api/tenants/:id - Obtener un tenant por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      
      const tenant = await tenants.findByPk(id);
      
      if (!tenant) {
        return res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Tenant no encontrado'
        });
      }
      
      res.json({
        success: true,
        data: tenant
      });
      
    } catch (error) {
      console.error('Error obteniendo tenant:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: 'Error al obtener tenant'
      });
    }
  },
  
  // PUT /api/tenants/:id - Actualizar un tenant
  async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const tenant = await tenants.findByPk(id);
      
      if (!tenant) {
        return res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Tenant no encontrado'
        });
      }
      
      // No permitir actualizar el código si ya está en uso
      if (updates.codigo && updates.codigo !== tenant.codigo) {
        const existingTenant = await tenants.findOne({ 
          where: { codigo: updates.codigo } 
        });
        if (existingTenant) {
          return res.status(400).json({
            success: false,
            error: 'CODE_EXISTS',
            message: 'El código del tenant ya está en uso'
          });
        }
      }
      
      await tenant.update(updates);
      
      res.json({
        success: true,
        message: 'Tenant actualizado exitosamente',
        data: tenant
      });
      
    } catch (error) {
      console.error('Error actualizando tenant:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: 'Error al actualizar tenant'
      });
    }
  },
  
  // DELETE /api/tenants/:id - Eliminar (desactivar) un tenant
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      const tenant = await tenants.findByPk(id);
      
      if (!tenant) {
        return res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Tenant no encontrado'
        });
      }
      
      // Soft delete: marcar como inactivo
      await tenant.update({ activo: false });
      
      res.json({
        success: true,
        message: 'Tenant desactivado exitosamente'
      });
      
    } catch (error) {
      console.error('Error eliminando tenant:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: 'Error al eliminar tenant'
      });
    }
  }
};

// Exportación CORRECTA - usando module.exports
module.exports = TenantController;