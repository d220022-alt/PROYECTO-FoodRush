const { productos, categorias, producto_variantes } = require("../models");

// Listar productos
exports.list = async (req, res) => {
  try {
    const data = await productos.findAll({
      include: [
        {
          model: categorias,
          as: "categoria",
          attributes: ["nombre"]
        }
      ],
      order: [["id", "ASC"]]
    });

    res.json(data);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error fetching products" });
  }
};

// Obtener producto + variantes
exports.getOne = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await productos.findByPk(id);

    if (!product)
      return res.status(404).json({ error: "Product not found" });

    const variants = await producto_variantes.findAll({
      where: { producto_id: id }
    });

    res.json({ product, variants });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ error: "db error" });
  }
};

// Crear producto
exports.create = async (req, res) => {
  const { tenant_id, categoria_id, nombre, descripcion } = req.body;

  try {
    const newProduct = await productos.create({
      tenant_id,
      categoria_id,
      nombre,
      descripcion
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ error: "create error" });
  }
};
