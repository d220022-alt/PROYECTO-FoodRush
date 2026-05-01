const express = require('express');
const realtimeController = require('../controllers/realtimeController');

const router = express.Router();

router.get('/stream', realtimeController.stream);
router.get('/assignments', realtimeController.listAssignments);
router.post('/assignments', realtimeController.upsertAssignment);
router.post('/location', realtimeController.recordLocation);

module.exports = router;
