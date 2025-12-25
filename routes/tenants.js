const express = require('express');
const router = express.Router();
const TenantController = require('../controllers/TenantController');

console.log('✅ Loading Simple Tenants Route');

// Simple, direct routing
router.get('/', TenantController.getAll);
router.get('/:id', TenantController.getById);
router.post('/', TenantController.create);
router.put('/:id', TenantController.update);
router.delete('/:id', TenantController.delete);

module.exports = router;