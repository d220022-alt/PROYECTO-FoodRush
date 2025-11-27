const express = require('express');
const app = express();
const cors = require('cors');

// Middlewares globales
app.use(cors());
app.use(express.json());

// Ejemplo de ruta base
app.get("/", (req, res) => {
  res.send("FoodRushMultiTenant API funcionando ✔");
});

// Yirbert aquí cargo las rutas reales, por ejemplo:
// const usuarioRoutes = require('./routes/usuarioRoutes');
// app.use('/api/usuarios', usuarioRoutes);
//:RARDIEL
module.exports = app;
