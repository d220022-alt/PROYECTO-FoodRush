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

        // Check if user exists first to avoid unique constraint error
        const [existing] = await sequelize.query("SELECT * FROM usuarios WHERE correo = 'test@foodrush.com' AND tenant_id = 1");

        if (existing.length > 0) {
            console.log("USER_ALREADY_EXISTS");
        } else {
            // Create with TENANT_ID = 1
            await sequelize.query(`
                INSERT INTO usuarios (tenant_id, nombre, correo, contrasena, direccion, zona, activo)
                VALUES (1, 'Usuario Test', 'test@foodrush.com', '123456', 'Calle Sol 123', 'gurabo', true)
            `);
            console.log("USER_CREATED_SUCCESSFULLY");
        }

    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await sequelize.close();
    }
}

run();
