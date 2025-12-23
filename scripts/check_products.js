const db = require('../models');

async function listProducts() {
    try {
        console.log('🍔 Listing Products...');
        const products = await db.productos.findAll({ limit: 5 });
        if (products.length === 0) {
            console.log('   ❌ No products found!');
        } else {
            products.forEach(p => {
                console.log(`   ✅ ID: ${p.id} - ${p.nombre}`);
            });
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
listProducts();
