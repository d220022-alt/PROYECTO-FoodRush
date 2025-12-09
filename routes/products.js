// routes/products.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Listar productos
router.get("/", productController.list);

// Obtener producto con variantes
router.get("/:id", productController.getOne);

// Crear producto
router.post("/", productController.create);

// Actualizar producto (parcial)
router.put("/:id", productController.update);

// Activar / desactivar
router.patch("/:id/toggle", productController.toggleActive);

module.exports = router;


