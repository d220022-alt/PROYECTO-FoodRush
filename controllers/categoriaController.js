/*
  Guia rapida para presentar:
  Catalogo publico de categorias por franquicia. Alimenta filtros y evita que el menu dependa de datos sueltos.
  Buscar en VS Code: categorias, catalogo publico, tenant, filtros.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const { categorias } = require('../models');

const categoriaController = {
  async listar(req, res) {
    try {
      const rows = await categorias.findAll({
        where: { tenant_id: req.tenantId },
        attributes: ['id', 'tenant_id', 'nombre', 'descripcion', 'creado_en'],
        order: [['id', 'ASC']]
      });

      res.json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error listando categorias:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  },

  async obtener(req, res) {
    try {
      const categoria = await categorias.findOne({
        where: {
          id: req.params.id,
          tenant_id: req.tenantId
        },
        attributes: ['id', 'tenant_id', 'nombre', 'descripcion', 'creado_en']
      });

      if (!categoria) {
        return res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Categoria no encontrada'
        });
      }

      res.json({
        success: true,
        data: categoria
      });
    } catch (error) {
      console.error('Error obteniendo categoria:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message
      });
    }
  }
};

module.exports = categoriaController;
