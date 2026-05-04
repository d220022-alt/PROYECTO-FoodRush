/*
  Guia rapida para presentar:
  Rutas de notificaciones para cliente y operacion.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const express = require('express');
const notificacionController = require('../controllers/notificacionController');

const router = express.Router();

router.get('/', notificacionController.listar);

module.exports = router;
