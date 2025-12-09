// app.js
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rutas
const productRoutes = require("./routes/products");

// Registrar rutas
app.use("/api/productos", productRoutes);

// Manejo de errores / rutas inexistentes
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

module.exports = app;
