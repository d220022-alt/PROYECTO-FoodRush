require("dotenv").config();
const app = require("./app");
const db = require("./models");

const PORT = Number(process.env.PORT) || 3000;
const DB_SYNC_ALTER = process.env.DB_SYNC_ALTER === "true";
const DB_CONNECT_RETRIES = Number(process.env.DB_CONNECT_RETRIES || 5);
const DB_CONNECT_RETRY_DELAY_MS = Number(process.env.DB_CONNECT_RETRY_DELAY_MS || 4000);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function connectAndSyncDatabase() {
  let lastError;

  for (let attempt = 1; attempt <= DB_CONNECT_RETRIES; attempt += 1) {
    try {
      console.log(`⏳ Intento ${attempt}/${DB_CONNECT_RETRIES}: conectando a BD...`);
      await db.sequelize.authenticate();
      console.log("✅ Conexion de BD establecida");

      console.log("⏳ Iniciando sincronizacion de BD...");
      await db.sequelize.sync({ alter: DB_SYNC_ALTER });
      console.log("✅ Base de datos sincronizada");
      return;
    } catch (error) {
      lastError = error;
      const errorCode = error?.original?.code || error?.parent?.code || error?.code || "UNKNOWN";
      console.error(`❌ Error de BD (intento ${attempt}/${DB_CONNECT_RETRIES}) [${errorCode}]: ${error.message}`);

      if (attempt < DB_CONNECT_RETRIES) {
        console.log(`↻ Reintentando en ${DB_CONNECT_RETRY_DELAY_MS}ms...`);
        await sleep(DB_CONNECT_RETRY_DELAY_MS);
      }
    }
  }

  throw lastError;
}

async function startServer() {
  try {
    await connectAndSyncDatabase();

    app.listen(PORT, () => {
      console.log(`\n🚀 FOODRUSH BACKEND INICIADO en puerto ${PORT}`);
      console.log(`   📍 http://localhost:${PORT}`);
      console.log(`   👤 Usuario BD: ${process.env.DB_USER || "No configurado"}`);
      console.log(`   🗄️  Base de datos: ${process.env.DB_NAME || "No configurado"}`);
      console.log("\n🔗 Endpoints disponibles:");
      console.log("   GET  /api/health           - Verificar estado");
      console.log("   GET  /api/test-models      - Ver modelos cargados");
      console.log("   GET  /api/productos        - Listar productos");
      console.log("   POST /api/productos        - Crear producto");
      console.log("   GET  /api/pedidos          - Listar pedidos");
      console.log("   POST /api/pedidos          - Crear pedido");
      console.log("   GET  /api/usuarios         - Listar usuarios");
      console.log("\n🔐 Para especificar tenant:");
      console.log("   Header: X-Tenant-ID: 1");
      console.log("   Query: ?tenant_id=1");
      console.log("\n📌 Nota: El sistema usa tenant_id=1 por defecto en desarrollo");
    });
  } catch (err) {
    console.error("❌ Error sincronizando BD:", err);
    process.exit(1);
  }
}

startServer();
