const app = require('./app');
const sequelize = require('./config/database');

const iniciarServidor = async () => {
  try {
    // Conexión con PostgreSQL
    await sequelize.authenticate();
    console.log("Conectado a PostgreSQL correctamente ✔");

    // Levantar servidor
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Error al conectar la base de datos:", error);
  }
};

iniciarServidor();




