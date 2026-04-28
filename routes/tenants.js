const express = require('express');
const TenantController = require('../controllers/TenantController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', TenantController.getAll);
router.get('/:id', TenantController.getById);

router.use(authMiddleware);

router.post('/', TenantController.create);
router.put('/:id', TenantController.update);
router.delete('/:id', TenantController.delete);

module.exports = router;
