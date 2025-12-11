const { usuarios } = require('../models');

const userController = {
  
  // GET /api/usuarios - Listar usuarios
  async listar(req, res) {
    try {
      console.log('🔍 Listando usuarios para tenant:', req.tenantId);
      
      const whereClause = {
        tenant_id: req.tenantId
      };
      
      const data = await usuarios.findAll({
        where: whereClause,
        attributes: { exclude: ['contrasena'] },
        order: [['creado_en', 'DESC']],
        limit: 20
      });
      
      res.json({
        success: true,
        data: data,
        message: data.length === 0 ? 'No hay usuarios para este tenant' : 'Usuarios encontrados'
      });
      
    } catch (error) {
      console.error('❌ Error listando usuarios:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  },
  
  // GET /api/usuarios/:id - Obtener un usuario
  async obtener(req, res) {
    try {
      const { id } = req.params;
      
      const usuario = await usuarios.findOne({
        where: {
          id: id,
          tenant_id: req.tenantId
        },
        attributes: { exclude: ['contrasena'] }
      });
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Usuario no encontrado'
        });
      }
      
      res.json({
        success: true,
        data: usuario
      });
      
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  },
  
  // POST /api/usuarios - Crear usuario
  async crear(req, res) {
    try {
      const { nombre, correo, contrasena, rol_id, telefono } = req.body;
      
      if (!nombre || !correo || !contrasena) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Nombre, correo y contraseña son requeridos'
        });
      }
      
      // Verificar que el correo no exista en el tenant
      const existe = await usuarios.findOne({
        where: {
          tenant_id: req.tenantId,
          correo
        }
      });
      
      if (existe) {
        return res.status(400).json({
          success: false,
          error: 'EMAIL_EXISTS',
          message: 'El correo ya está registrado en este tenant'
        });
      }
      
      const usuario = await usuarios.create({
        tenant_id: req.tenantId,
        nombre,
        correo,
        contrasena, // En producción, esto debería estar encriptado
        rol_id: rol_id || null,
        telefono,
        activo: true
      });
      
      // No devolver la contraseña
      const usuarioSinPassword = await usuarios.findByPk(usuario.id, {
        attributes: { exclude: ['contrasena'] }
      });
      
      res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        data: usuarioSinPassword
      });
      
    } catch (error) {
      console.error('Error creando usuario:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  },
  
  // PUT /api/usuarios/:id - Actualizar usuario
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // No permitir actualizar contraseña por esta ruta
      if (updates.contrasena) {
        delete updates.contrasena;
      }
      
      const usuario = await usuarios.findOne({
        where: {
          id: id,
          tenant_id: req.tenantId
        }
      });
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Usuario no encontrado'
        });
      }
      
      await usuario.update(updates);
      
      const usuarioActualizado = await usuarios.findByPk(id, {
        attributes: { exclude: ['contrasena'] }
      });
      
      res.json({
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: usuarioActualizado
      });
      
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  },
  
  // DELETE /api/usuarios/:id - Desactivar usuario
  async eliminar(req, res) {
    try {
      const { id } = req.params;
      
      const usuario = await usuarios.findOne({
        where: {
          id: id,
          tenant_id: req.tenantId
        }
      });
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Usuario no encontrado'
        });
      }
      
      await usuario.update({ activo: false });
      
      res.json({
        success: true,
        message: 'Usuario desactivado exitosamente'
      });
      
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  }
};

module.exports = userController;