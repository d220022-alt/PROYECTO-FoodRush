const db = require("../models");
const Usuarios = db.usuarios; // Nombre correcto según sequelize-auto
const bcrypt = require("bcryptjs");

// Crear usuario
exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, correo, contrasena, rol_id, tenant_id } = req.body;

    if (!nombre || !correo || !contrasena || !tenant_id) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // Validar duplicados
    const existeCorreo = await Usuarios.findOne({ where: { correo } });
    if (existeCorreo) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    // Encriptar contraseña
    const hashed = await bcrypt.hash(contrasena, 10);

    const usuario = await Usuarios.create({
      nombre,
      correo,
      contrasena: hashed,
      rol_id: rol_id ?? null,
      tenant_id
    });

    res.status(201).json(usuario);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuarios.findAll({
      order: [["id", "ASC"]],
      attributes: { exclude: ["contrasena"] } // Seguridad
    });

    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};


