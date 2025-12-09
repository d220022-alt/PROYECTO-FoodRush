const db = require("../models");

const Producto = db.productos;
const Variantes = db.productosvariantes;
const Categorias = db.categorias;

module.exports = {
  // GET /api/productos
  async list(req, res) {
    try {
      const productos = await Producto.findAll({
        include: [
          { model: Categorias, as: "categoria" },
          { model: Variantes, as: "variantes" }
        ],
      });

      res.json(productos);
    } catch (error) {
      console.error("Error listando productos:", error);
      res.status(500).json({ error: "Error listando productos" });
    }
  },

  // GET /api/productos/:id
  async getOne(req, res) {
    try {
      const { id } = req.params;

      const producto = await Producto.findByPk(id, {
        include: [
          { model: Categorias, as: "categoria" },
          { model: Variantes, as: "variantes" },
        ],
      });

      if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      res.json(producto);
    } catch (error) {
      console.error("Error obteniendo producto:", error);
      res.status(500).json({ error: "Error interno" });
    }
  },

  // POST /api/productos
  async create(req, res) {
    try {
      const producto = await Producto.create(req.body);
      res.status(201).json(producto);
    } catch (error) {
      console.error("Error creando producto:", error);
      res.status(500).json({ error: "Error creando producto" });
    }
  },

  // PUT /api/productos/:id
  async update(req, res) {
    try {
      const { id } = req.params;

      const producto = await Producto.findByPk(id);
      if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      await producto.update(req.body);

      res.json(producto);
    } catch (error) {
      console.error("Error actualizando producto:", error);
      res.status(500).json({ error: "Error actualizando producto" });
    }
  },

  // PATCH /api/productos/:id/toggle
  async toggleActive(req, res) {
    try {
      const { id } = req.params;

      const producto = await Producto.findByPk(id);
      if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      producto.activo = !producto.activo;
      await producto.save();

      res.json({ mensaje: "Estado actualizado", activo: producto.activo });
    } catch (error) {
      console.error("Error cambiando estado:", error);
      res.status(500).json({ error: "Error cambiando estado" });
    }
  },
};
