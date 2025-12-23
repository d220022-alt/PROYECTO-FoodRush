const db = require('../models');

async function listCats() {
    try {
        const cats = await db.categorias.findAll();
        cats.forEach(c => console.log(`Category ID ${c.id}: '${c.nombre}' (Tenant ${c.tenant_id})`));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
listCats();
