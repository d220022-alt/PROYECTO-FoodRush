const express = require("express");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();

// 🛡️ Seguridad: Headers HTTP (Helmet)
app.use(helmet());

// 🛡️ Seguridad: Rate Limiting (Protección contra DDoS/Brute Force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 300, // Límite de 300 peticiones por IP por ventana
  standardHeaders: true, // Retorna info del rate limit en los headers `RateLimit-*`
  legacyHeaders: false, // Deshabilita los headers `X-RateLimit-*`
  message: {
    status: 429,
    error: 'TOO_MANY_REQUESTS',
    message: 'Has excedido el límite de peticiones. Intenta más tarde.'
  }
});

// Aplicar el limitador a todas las peticiones
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Habilitar CORS
const cors = require('cors');
app.use(cors());

// Middleware pa' que jale el tenant (truquito para desarrollo)
app.use((req, res, next) => {
  // Si estamos probando, aceptamos el tenant por header o url
  req.tenantId = req.headers['x-tenant-id'] || req.query.tenant_id || 1;
  console.log(`🔐 Tenant ID: ${req.tenantId}`);
  next();
});

// Aquí nos traemos las rutas (los caminitos de la API)
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const tenantRoutes = require("./routes/tenants");
const userRoutes = require("./routes/users");

// Le decimos a la app que use estas rutas
app.use("/api/productos", productRoutes);
app.use("/api/pedidos", orderRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/usuarios", userRoutes);

// Cargar rutas dinámicas para el resto de las tablas
const setupDynamicRoutes = require("./routes/autoLoader");
setupDynamicRoutes(app);

// Ruta pa' ver si el server sigue vivo
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "FoodRush Backend funcionando",
    timestamp: new Date().toISOString(),
    tenantId: req.tenantId,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta pa checar que los modelos cargaron bien (DEBUG)
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

// Ruta raíz de bienvenida (pa' que no se vea feo el error 404 al principio)
app.get("/", (req, res) => {
  res.json({
    message: "¡Bienvenido al Backend de FoodRush! 🍕🚀",
    status: "Online",
    version: "1.0.0",
    docs: "Consulta /api/health para ver el estado del sistema",
    tenant: req.tenantId
  });
});

// Si llegaste aquí es porque esa ruta no existe (404)
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    path: req.path,
    method: req.method,
    tenant: req.tenantId
  });
});

// Manejador de errores (si algo explota, cae aquí)
app.use((err, req, res, next) => {
  console.error("❌ Error del servidor:", err.stack);
  res.status(500).json({
    error: "Error interno del servidor",
    message: process.env.NODE_ENV === 'development' ? err.message : "Contacta al administrador",
    tenant: req.tenantId
  });
});

module.exports = app;