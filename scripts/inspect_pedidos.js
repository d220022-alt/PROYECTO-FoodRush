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
        const [results] = await sequelize.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'pedidos'");
        console.log("COLUMNS IN 'PEDIDOS':");
        results.forEach(r => console.log(`- ${r.column_name}`));
    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
    }
}

run();
