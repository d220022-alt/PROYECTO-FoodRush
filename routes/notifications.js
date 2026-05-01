const express = require('express');
const notificacionController = require('../controllers/notificacionController');

const router = express.Router();

router.get('/', notificacionController.listar);

module.exports = router;
