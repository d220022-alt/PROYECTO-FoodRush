require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 3000;

// Sincronizar base de datos (aquí le decimos a la BD que se ponga ready sin borrar nada)
const db = require("./models");

db.sequelize.sync({ alter: false })  // alter: false pa' que no se nos borren las tablas si la regamos
  .then(() => {
    console.log("✅ Base de datos sincronizada");

    app.listen(PORT, () => {
      console.log(`\n🚀 FOODRUSH BACKEND INICIADO`);
      console.log(`   📍 http://localhost:${PORT}`);
      console.log(`   👤 Usuario BD: ${process.env.DB_USER || 'No configurado'}`);
      console.log(`   🗄️  Base de datos: ${process.env.DB_NAME || 'No configurado'}`);
      console.log(`\n🔗 Endpoints disponibles:`);
      console.log(`   GET  /api/health           - Verificar estado`);
      console.log(`   GET  /api/test-models      - Ver modelos cargados`);
      console.log(`   GET  /api/productos        - Listar productos`);
      console.log(`   POST /api/productos        - Crear producto`);
      console.log(`   GET  /api/pedidos          - Listar pedidos`);
      console.log(`   POST /api/pedidos          - Crear pedido`);
      console.log(`   GET  /api/usuarios         - Listar usuarios`);
      console.log(`\n🔐 Para especificar tenant:`);
      console.log(`   Header: X-Tenant-ID: 1`);
      console.log(`   Query: ?tenant_id=1`);
      console.log(`\n📌 Nota: El sistema usa tenant_id=1 por defecto en desarrollo`);
    });
  })
  .catch(err => {
    console.error("❌ Error sincronizando BD:", err);
    process.exit(1);
  });