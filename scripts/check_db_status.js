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

        // 1. Check if 'usuarios' table exists and has data
        const [users] = await sequelize.query("SELECT * FROM usuarios");

        if (users.length === 0) {
            console.log("NO_USERS_FOUND");
            // Create default
            await sequelize.query(`
                INSERT INTO usuarios (nombre, correo, contrasena, direccion, zona)
                VALUES ('Usuario Test', 'test@foodrush.com', '123456', 'Calle Sol 123', 'gurabo')
            `);
            console.log("DEFAULT_USER_CREATED: test@foodrush.com / 123456");
        } else {
            console.log("USERS_FOUND:");
            users.forEach(u => {
                console.log(`- ${u.correo} | Pass: ${u.contrasena} | ID: ${u.id}`);
            });
        }

        // 2. Check Orders
        const [orders] = await sequelize.query("SELECT count(*) as count FROM pedidos");
        console.log(`TOTAL_ORDERS: ${orders[0].count}`);

    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await sequelize.close();
    }
}

run();
