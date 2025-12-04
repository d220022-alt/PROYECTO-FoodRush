// app.js
const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Ruta base
app.get("/", (req, res) => {
  res.send("FoodRushMultiTenant API funcionando ✔");
});

// Aquí se cargarán las rutas reales cuando existan
// const usuarioRoutes = require("./routes/usuarioRoutes");
// app.use("/api/usuarios", usuarioRoutes);

module.exports = app;

