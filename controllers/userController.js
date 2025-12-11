const { usuarios } = require('../models');

const userController = {

  // GET /api/usuarios - Ver a la banda (usuarios)
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

  // GET /api/usuarios/:id - Stalkear a un usuario
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

  // POST /api/usuarios - Reclutar gente nueva
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

      // Checamos si ya existe el correo (pa' no duplicar)
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
        contrasena, // En producción encryptamos esto, ahorita YOLO
        rol_id: rol_id || null,
        telefono,
        activo: true
      });

      // Escondemos la contraseña pa' que no la vean
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

  // PUT /api/usuarios/:id - Cambiar datos del usuario
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // La contraseña no se toca por aquí, joven
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

  // DELETE /api/usuarios/:id - Banear al usuario (desactivar)
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