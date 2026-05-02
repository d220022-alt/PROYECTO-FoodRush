const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const tenantMiddleware = require('./middleware/tenantMiddleware');
const authMiddleware = require('./middleware/authMiddleware');

const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const tenantRoutes = require('./routes/tenants');
const userRoutes = require('./routes/users');
const notificationRoutes = require('./routes/notifications');
const realtimeRoutes = require('./routes/realtime');
const adminOperationRoutes = require('./routes/adminOperations');
const setupDynamicRoutes = require('./routes/autoLoader');

const app = express();

app.set('trust proxy', 1);
app.use(helmet());

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()).filter(Boolean)
  : null;

app.use(cors({
  origin(origin, callback) {
    if (!origin || !allowedOrigins || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origen no permitido por CORS'));
  },
  credentials: true,
  exposedHeaders: ['Retry-After', 'RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset']
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'TOO_MANY_REQUESTS',
    message: 'Has excedido el limite de peticiones. Intenta mas tarde.'
  }
});

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'FoodRush Backend funcionando',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/api/productos', tenantMiddleware, productRoutes);
app.use('/api/pedidos', authMiddleware, tenantMiddleware, orderRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/usuarios', tenantMiddleware, userRoutes);
app.use('/api/notificaciones', authMiddleware, tenantMiddleware, notificationRoutes);
app.use('/api/realtime', authMiddleware, tenantMiddleware, realtimeRoutes);
app.use('/api/admin/operations', authMiddleware, tenantMiddleware, adminOperationRoutes);

setupDynamicRoutes(app, { tenantMiddleware, authMiddleware });

if (process.env.NODE_ENV !== 'production') {
  app.get('/api/test-models', async (req, res) => {
    try {
      const db = require('./models');
      const models = Object.keys(db).filter(key => !['sequelize', 'Sequelize'].includes(key));

      res.json({
        success: true,
        message: `${models.length} modelos cargados`,
        models: models.sort()
      });
    } catch (error) {
      res.status(500).json({ error: 'Error cargando modelos' });
    }
  });
}

app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido al Backend de FoodRush',
    status: 'Online',
    version: '1.0.0',
    docs: 'Consulta /api/health para ver el estado del sistema'
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method
  });
});

app.use((err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';
  console.error('Error del servidor:', isProduction ? err.message : err.stack);

  res.status(500).json({
    error: 'Error interno del servidor',
    message: isProduction ? 'Contacta al administrador' : err.message
  });
});

module.exports = app;
