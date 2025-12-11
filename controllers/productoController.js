const { productos, productosvariantes, categorias } = require('../models');

const productoController = {

  // GET /api/productos - Ver qué hay en la bodega (del tenant actual)
  async listar(req, res) {
    try {
      console.log('🔍 Listando productos para tenant:', req.tenantId);

      const { categoria_id, activo, pagina = 1, limite = 20 } = req.query;
      const offset = (pagina - 1) * limite;

      const whereClause = {
        tenant_id: req.tenantId
      };

      if (categoria_id) whereClause.categoria_id = categoria_id;
      if (activo !== undefined) whereClause.activo = activo === 'true';

      // PRIMERO: A ver si jala sin tanta cosa (sin includes)
      const { count, rows } = await productos.findAndCountAll({
        where: whereClause,
        attributes: ['id', 'nombre', 'descripcion', 'precio', 'activo', 'creado_en'],
        limit: parseInt(limite),
        offset: parseInt(offset),
        order: [['creado_en', 'DESC']]
      });

      // Si no hay nada, mandamos nada (vacío)
      if (count === 0) {
        return res.json({
          success: true,
          data: [],
          message: 'No hay productos para este tenant',
          paginacion: {
            total: 0,
            pagina: parseInt(pagina),
            totalPaginas: 0,
            limite: parseInt(limite)
          }
        });
      }

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
      console.error('❌ Error listando productos:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message // Esto mostrará el error real
      });
    }
  },

  // GET /api/productos/:id - Traer una sola cosa
  async obtener(req, res) {
    try {
      const { id } = req.params;

      const producto = await productos.findOne({
        where: {
          id: id,
          tenant_id: req.tenantId
        }
      });

      if (!producto) {
        return res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Producto no encontrado'
        });
      }

      res.json({
        success: true,
        data: producto
      });

    } catch (error) {
      console.error('Error obteniendo producto:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  },

  // POST /api/productos - Armar un nuevo producto (versión facilito pa' probar)
  async crear(req, res) {
    try {
      const { nombre, descripcion, precio } = req.body;

      if (!nombre || !precio) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Nombre y precio son requeridos'
        });
      }

      const producto = await productos.create({
        tenant_id: req.tenantId,
        nombre,
        descripcion: descripcion || '',
        precio: parseFloat(precio),
        activo: true
      });

      res.status(201).json({
        success: true,
        message: 'Producto creado exitosamente',
        data: producto
      });

    } catch (error) {
      console.error('Error creando producto:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  },

  // PUT /api/productos/:id - Cambiarle algo al producto
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const producto = await productos.findOne({
        where: {
          id: id,
          tenant_id: req.tenantId
        }
      });

      if (!producto) {
        return res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Producto no encontrado'
        });
      }

      await producto.update(updates);

      res.json({
        success: true,
        message: 'Producto actualizado exitosamente',
        data: producto
      });

    } catch (error) {
      console.error('Error actualizando producto:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  },

  // DELETE /api/productos/:id - "Borrar" el producto (mentira, solo lo escondemos)
  async eliminar(req, res) {
    try {
      const { id } = req.params;

      const producto = await productos.findOne({
        where: {
          id: id,
          tenant_id: req.tenantId
        }
      });

      if (!producto) {
        return res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Producto no encontrado'
        });
      }

      await producto.update({ activo: false });

      res.json({
        success: true,
        message: 'Producto desactivado exitosamente'
      });

    } catch (error) {
      console.error('Error eliminando producto:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  },

  // POST /api/productos/:id/variantes - Ponerle opciones (size, color, etc)
  async agregarVariante(req, res) {
    try {
      const { id } = req.params;
      const { nombre, precio_adicional, descripcion } = req.body;

      const producto = await productos.findOne({
        where: {
          id: id,
          tenant_id: req.tenantId
        }
      });

      if (!producto) {
        return res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Producto no encontrado'
        });
      }

      const variante = await productosvariantes.create({
        tenant_id: req.tenantId,
        producto_id: id,
        nombre,
        precio_adicional: parseFloat(precio_adicional) || 0,
        descripcion,
        activo: true
      });

      res.status(201).json({
        success: true,
        message: 'Variante agregada exitosamente',
        data: variante
      });

    } catch (error) {
      console.error('Error agregando variante:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  },

  // PATCH /api/productos/:id/toggle - Prenderlo o apagarlo
  async toggleActivo(req, res) {
    try {
      const { id } = req.params;

      const producto = await productos.findOne({
        where: {
          id: id,
          tenant_id: req.tenantId
        }
      });

      if (!producto) {
        return res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Producto no encontrado'
        });
      }

      await producto.update({ activo: !producto.activo });

      res.json({
        success: true,
        message: `Producto ${producto.activo ? 'activado' : 'desactivado'} exitosamente`,
        data: { activo: producto.activo }
      });

    } catch (error) {
      console.error('Error alternando estado:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  }
};

module.exports = productoController;