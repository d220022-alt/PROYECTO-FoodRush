const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const sequelize = new Sequelize(
    process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS,
    { host: process.env.DB_HOST, dialect: 'postgres', logging: false }
);

async function run() {
    try {
        await sequelize.authenticate();

        // Check for user 'Rardiel'
        const [users] = await sequelize.query("SELECT * FROM usuarios WHERE correo ILIKE '%rardiel%' OR nombre ILIKE '%rardiel%'");

        if (users.length > 0) {
            console.log("Rardiel Account Found:");
            console.log(`Email: ${users[0].correo}`);
            console.log(`Password: ${users[0].contrasena}`);
        } else {
            console.log("Creating Rardiel Account...");
            await sequelize.query(`
                INSERT INTO usuarios (tenant_id, nombre, correo, contrasena, direccion, zona, activo)
                VALUES (1, 'Rardiel Ceballo', 'rardiel@foodrush.com', '123456', 'Calle Principal #1', 'gurabo', true)
            `);
            console.log("Rardiel Account Created:");
            console.log("Email: rardiel@foodrush.com");
            console.log("Password: 123456");
        }
    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await sequelize.close();
    }
}

run();
