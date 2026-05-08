/*
  Guia rapida para presentar:
  Rutas publicas del catalogo de categorias. Las mutaciones siguen quedando en rutas protegidas automaticas.
  Buscar en VS Code: endpoint categorias, catalogo publico, filtros.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const express = require('express');
const categoriaController = require('../controllers/categoriaController');

const router = express.Router();

router.get('/', categoriaController.listar);
router.get('/:id', categoriaController.obtener);

module.exports = router;
