
const db = require('./models');

async function checkImages() {
    try {
        await db.sequelize.authenticate();
        const products = await db.productos.findAll({
            where: { tenant_id: 2 },
            attributes: ['id', 'nombre', 'img']
        });

        console.log('Current Database Images for Tenant 2:');
        products.forEach(p => console.log(`${p.nombre}: ${p.img}`));

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkImages();
