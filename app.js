const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware tenant simplificado (para desarrollo)
app.use((req, res, next) => {
  // Para desarrollo, aceptar tenant por header o query
  req.tenantId = req.headers['x-tenant-id'] || req.query.tenant_id || 1;
  console.log(`🔐 Tenant ID: ${req.tenantId}`);
  next();
});

// Importar rutas con nombres correctos
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const tenantRoutes = require("./routes/tenants");
const userRoutes = require("./routes/users");

// Registrar rutas
app.use("/api/productos", productRoutes);
app.use("/api/pedidos", orderRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/usuarios", userRoutes);

// Ruta de salud
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "FoodRush Backend funcionando",
    timestamp: new Date().toISOString(),
    tenantId: req.tenantId,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta de prueba de modelos - ¡NUEVA RUTA!
app.get("/api/test-models", async (req, res) => {
  try {
    const db = require('./models');
    const modelCount = Object.keys(db).filter(key => !['sequelize', 'Sequelize'].includes(key)).length;

    res.json({
      success: true,
      message: `✅ ${modelCount} modelos cargados`,
      models: Object.keys(db).filter(key => !['sequelize', 'Sequelize'].includes(key)).sort(),
      tenantId: req.tenantId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta raíz de bienvenida
app.get("/", (req, res) => {
  res.json({
    message: "¡Bienvenido al Backend de FoodRush! 🍕🚀",
    status: "Online",
    version: "1.0.0",
    docs: "Consulta /api/health para ver el estado del sistema",
    tenant: req.tenantId
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    path: req.path,
    method: req.method,
    tenant: req.tenantId
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error del servidor:", err.stack);
  res.status(500).json({
    error: "Error interno del servidor",
    message: process.env.NODE_ENV === 'development' ? err.message : "Contacta al administrador",
    tenant: req.tenantId
  });
});

module.exports = app;