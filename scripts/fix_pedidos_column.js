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
        console.log("Adding 'direccion_entrega' column to 'pedidos'...");

        await sequelize.query(`
            ALTER TABLE pedidos 
            ADD COLUMN IF NOT EXISTS direccion_entrega VARCHAR(255);
        `);

        console.log("Column added successfully.");

    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await sequelize.close();
    }
}

run();
