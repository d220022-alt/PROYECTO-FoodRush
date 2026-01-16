const { productos, productosvariantes, categorias } = require('../models');

const productoController = {

  // GET /api/productos - Ver qué hay en la bodega (del tenant actual)
  // GET /api/productos - Ver qué hay en la bodega (del tenant actual)
  async listar(req, res) {
    try {
      console.log('🔍 Listando productos para tenant:', req.tenantId);

      const { categoria_id, activo, pagina = 1, limite = 100 } = req.query; // Aumentamos límite por defecto
      const offset = (pagina - 1) * limite;

      const whereClause = {
        tenant_id: req.tenantId
      };

      if (categoria_id) whereClause.categoria_id = categoria_id;
      if (activo !== undefined) whereClause.activo = activo === 'true';

      // Importar modelo de imagenes necesario para el include
      const { productos_imagenes } = require('../models');

      // Asegurar asociación explícita para evitar el error de Sequelize
      if (!productos.associations.imagenes) {
        productos.hasMany(productos_imagenes, { foreignKey: 'producto_id', as: 'imagenes' });
      }

      // 1. Get Products (with images)
      const { count, rows } = await productos.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: productos_imagenes,
            as: 'imagenes',
            attributes: ['imagen_url'],
            limit: 1
          }
        ],
        attributes: ['id', 'nombre', 'descripcion', 'precio', 'activo', 'categoria_id'], // Need cat_id
        distinct: true,
        limit: parseInt(limite),
        offset: parseInt(offset),
        order: [['id', 'ASC']]
      });

      // 2. Custom "Join" for Categories (Bypassing Include issues)
      // Fetch ALL categories to ensure we find matches (ID is unique anyway)
      const categoriesList = await categorias.findAll({
        attributes: ['id', 'nombre']
      });
      const catMap = {};
      categoriesList.forEach(c => catMap[c.id] = c.nombre);

      console.log('DEBUG CONTROLLER: Tenant', req.tenantId);
      console.log('DEBUG CONTROLLER: CatMap', JSON.stringify(catMap));

      // 3. Map Data
      const data = rows.map(p => {
        const plain = p.get({ plain: true });

        return {
          ...plain,
          img: plain.imagenes && plain.imagenes.length > 0 ? plain.imagenes[0].imagen_url : 'https://via.placeholder.com/150',
          category: catMap[plain.categoria_id] || 'Bebidas' // Fallback to Bebidas to ensure visibility
        };
      });

      res.json({
        success: true,
        data: data,
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
        message: error.message
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