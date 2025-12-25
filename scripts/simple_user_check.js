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
        const [results] = await sequelize.query("SELECT * FROM usuarios WHERE correo = 'test@foodrush.com'");

        if (results.length > 0) {
            console.log('USER_FOUND');
            console.log('EMAIL: test@foodrush.com');
            console.log('PASS: 123456'); // Assuming legacy/simple
        } else {
            console.log('CREATING_USER');
            await sequelize.query(`
                INSERT INTO usuarios (nombre, correo, contrasena, direccion, zona, rol)
                VALUES ('Usuario Test', 'test@foodrush.com', '123456', 'Calle Sol 123', 'gurabo', 'cliente')
            `);
            console.log('USER_CREATED');
            console.log('EMAIL: test@foodrush.com');
            console.log('PASS: 123456');
        }
    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await sequelize.close();
    }
}

run();
