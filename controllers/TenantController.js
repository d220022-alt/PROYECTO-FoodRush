const { Tenant } = require("../models");

// Crear tenant
exports.crearTenant = async (req, res) => {
  try {
    const { nombre, tipo, direccion, telefono, dominio, estatus } = req.body;
    if (!nombre || !tipo) {
      return res.status(400).json({ error: "nombre y tipo son obligatorios" });
    }

    const tenant = await Tenant.create({
      nombre,
      tipo,
      direccion,
      telefono,
      dominio,
      estatus
    });

    res.status(201).json(tenant);
  } catch (error) {
    console.error("Error al crear tenant:", error);
    res.status(500).json({ error: "Error al crear tenant" });
  }
};

// Obtener todos los tenants
exports.obtenerTenants = async (req, res) => {
  try {
    const tenants = await Tenant.findAll();
    res.json(tenants);
  } catch (error) {
    console.error("Error al obtener tenants:", error);
    res.status(500).json({ error: "Error al obtener tenants" });
  }
};
