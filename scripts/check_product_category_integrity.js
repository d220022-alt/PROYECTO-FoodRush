const db = require('../models');

async function checkIntegrity() {
    try {
        console.log('🔍 Checking Product -> Category Integrity...');

        const products = await db.productos.findAll();
        console.log(`Products Count: ${products.length}`);

        for (const p of products) {
            const cat = await db.categorias.findByPk(p.categoria_id);
            console.log(`Product [${p.id}] ${p.nombre} (Tenant ${p.tenant_id}) -> Category ID: ${p.categoria_id} -> Found: ${cat ? 'YES (' + cat.nombre + ')' : 'NO'}`);
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
checkIntegrity();
