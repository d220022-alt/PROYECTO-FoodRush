const { Usuario } = require("../models");

exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, correo, contrasena, rol, tenantId } = req.body;

    const usuario = await Usuario.create({
      nombre,
      correo,
      contrasena,
      rol,
      tenantId
    });

    res.status(201).json(usuario);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

