const db = require('./models');

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Conexión Sequelize exitosa");
  } catch (error) {
    console.error("Error conectando Sequelize:", error);
  }
})();
