
const db = require('./models');

async function checkImages() {
    try {
        await db.sequelize.authenticate();
        // Raw query to bypass model quirks
        const [results] = await db.sequelize.query('SELECT id, nombre, img FROM productos WHERE tenant_id = 2');

        console.log('Current Database Images for Tenant 2 (Raw SQL):');
        results.forEach(p => console.log(`${p.nombre}: ${p.img}`));

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkImages();
