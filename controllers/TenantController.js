const db = require("../models");
const Tenants = db.tenants; // nombre correcto según sequelize-auto

// Crear tenant
exports.crearTenant = async (req, res) => {
  try {
    const { nombre, tipo, direccion, telefono, dominio, estatus } = req.body;

    if (!nombre || !tipo) {
      return res.status(400).json({ error: "nombre y tipo son obligatorios" });
    }

    const nuevoTenant = await Tenants.create({
      nombre,
      tipo,
      direccion,
      telefono,
      dominio,
      estatus: estatus ?? true
    });

    res.status(201).json(nuevoTenant);
  } catch (error) {
    console.error("Error al crear tenant:", error);
    res.status(500).json({ error: "Error al crear tenant" });
  }
};

// Obtener todos los tenants
exports.obtenerTenants = async (req, res) => {
  try {
    const tenants = await Tenants.findAll({
      order: [["id", "ASC"]]
    });

    res.json(tenants);
  } catch (error) {
    console.error("Error al obtener tenants:", error);
    res.status(500).json({ error: "Error al obtener tenants" });
  }
};
