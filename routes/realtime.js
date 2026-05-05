/*
  Guia rapida para presentar:
  Rutas de eventos en vivo y asignaciones de delivery.
  Buscar en VS Code: endpoint realtime, SSE, suscripcion, eventos admin delivery.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const express = require('express');
const realtimeController = require('../controllers/realtimeController');

const router = express.Router();

router.get('/stream', realtimeController.stream);
router.get('/assignments', realtimeController.listAssignments);
router.post('/assignments', realtimeController.upsertAssignment);
router.post('/location', realtimeController.recordLocation);

module.exports = router;
