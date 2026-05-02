const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op, Sequelize } = require('sequelize');
const { usuarios } = require('../models');

const BCRYPT_REGEX = /^\$2[aby]\$\d{2}\$/;
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

function isBcryptHash(value) {
  return typeof value === 'string' && BCRYPT_REGEX.test(value);
}

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(plainPassword, storedPassword) {
  if (!storedPassword) return false;
  if (isBcryptHash(storedPassword)) {
    return bcrypt.compare(plainPassword, storedPassword);
  }
  return storedPassword === plainPassword;
}

function signUserToken(usuario) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no configurado');
  }

  return jwt.sign({
    sub: String(usuario.id),
    tenant_id: Number(usuario.tenant_id),
    rol_id: usuario.rol_id ? Number(usuario.rol_id) : null
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

function serverErrorMessage(error) {
  return process.env.NODE_ENV === 'production'
    ? 'Error interno del servidor'
    : error.message;
}

const userController = {
  async listar(req, res) {
    try {
      const data = await usuarios.findAll({
        where: { tenant_id: req.tenantId },
        attributes: { exclude: ['contrasena'] },
        order: [['creado_en', 'DESC']],
        limit: 20
      });

      res.json({
        success: true,
        data,
        message: data.length === 0 ? 'No hay usuarios para este tenant' : 'Usuarios encontrados'
      });
    } catch (error) {
      console.error('Error listando usuarios:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: serverErrorMessage(error)
      });
    }
  },

  async login(req, res) {
    try {
      const rawIdentifier = req.body.identifier || req.body.usuario || req.body.username || req.body.email || req.body.correo;
      const password = req.body.password || req.body.contrasena;
      const identifier = String(rawIdentifier || '').trim();
      const normalizedIdentifier = identifier.toLowerCase();

      if (!identifier || !password) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Usuario/correo y contrasena son requeridos'
        });
      }

      const candidates = await usuarios.findAll({
        where: {
          tenant_id: req.tenantId,
          [Op.or]: [
            Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('correo')), normalizedIdentifier),
            Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('nombre')), normalizedIdentifier)
          ]
        },
        limit: 20,
        order: [['id', 'DESC']]
      });

      let usuario = null;
      let inactiveMatch = null;

      for (const candidate of candidates) {
        const candidatePasswordOk = await verifyPassword(password, candidate.contrasena);
        if (!candidatePasswordOk) continue;

        if (!candidate.activo) {
          inactiveMatch = inactiveMatch || candidate;
          continue;
        }

        usuario = candidate;
        break;
      }

      if (!usuario && inactiveMatch) {
        return res.status(403).json({
          success: false,
          error: 'USER_INACTIVE',
          message: 'Usuario desactivado'
        });
      }

      if (!usuario) {
        return res.status(401).json({
          success: false,
          error: 'AUTH_ERROR',
          message: 'Credenciales invalidas'
        });
      }

      if (!usuario.activo) {
        return res.status(403).json({
          success: false,
          error: 'USER_INACTIVE',
          message: 'Usuario desactivado'
        });
      }

      if (!isBcryptHash(usuario.contrasena)) {
        await usuario.update({ contrasena: await hashPassword(password) });
      }

      const userData = usuario.toJSON();
      delete userData.contrasena;

      res.json({
        success: true,
        message: 'Login exitoso',
        token: signUserToken(usuario),
        user: userData
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: serverErrorMessage(error)
      });
    }
  },

  async obtener(req, res) {
    try {
      const { id } = req.params;

      const usuario = await usuarios.findOne({
        where: {
          id,
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
        message: serverErrorMessage(error)
      });
    }
  },

  async crear(req, res) {
    try {
      const { nombre, correo, contrasena, rol_id, telefono } = req.body;

      if (!nombre || !correo || !contrasena) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Nombre, correo y contrasena son requeridos'
        });
      }

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
          message: 'El correo ya esta registrado en este tenant'
        });
      }

      const usuario = await usuarios.create({
        tenant_id: req.tenantId,
        nombre,
        correo,
        contrasena: await hashPassword(contrasena),
        rol_id: rol_id || null,
        telefono,
        direccion: req.body.direccion || null,
        zona: req.body.zona || null,
        activo: true
      });

      const usuarioSinPassword = await usuarios.findOne({
        where: {
          id: usuario.id,
          tenant_id: req.tenantId
        },
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
        message: serverErrorMessage(error)
      });
    }
  },

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const updates = { ...req.body };

      delete updates.id;
      delete updates.tenant_id;
      delete updates.contrasena;

      const usuario = await usuarios.findOne({
        where: {
          id,
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

      const usuarioActualizado = await usuarios.findOne({
        where: {
          id,
          tenant_id: req.tenantId
        },
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
        message: serverErrorMessage(error)
      });
    }
  },

  async eliminar(req, res) {
    try {
      const { id } = req.params;

      const usuario = await usuarios.findOne({
        where: {
          id,
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
        message: serverErrorMessage(error)
      });
    }
  },

  async cambiarContrasena(req, res) {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Se requieren la contrasena actual y la nueva'
        });
      }

      const usuario = await usuarios.findOne({
        where: {
          id,
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

      const passwordOk = await verifyPassword(currentPassword, usuario.contrasena);

      if (!passwordOk) {
        return res.status(401).json({
          success: false,
          error: 'AUTH_ERROR',
          message: 'La contrasena actual es incorrecta'
        });
      }

      await usuario.update({ contrasena: await hashPassword(newPassword) });

      res.json({
        success: true,
        message: 'Contrasena actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error cambiando contrasena:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: serverErrorMessage(error)
      });
    }
  }
};

module.exports = userController;
