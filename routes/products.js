const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Listar productos
router.get("/", productController.list);

// Obtener producto con variantes
router.get("/:id", productController.getOne);

// Crear producto
router.post("/", productController.create);

module.exports = router;

