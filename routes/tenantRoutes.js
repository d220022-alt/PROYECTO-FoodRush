const express = require("express");
const router = express.Router();
const tenantController = require("../controllers/TenantController");

router.post("/", tenantController.crearTenant);
router.get("/", tenantController.obtenerTenants);

module.exports = router;
