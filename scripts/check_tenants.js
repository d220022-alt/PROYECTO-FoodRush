const db = require('../models');

async function listTenants() {
    try {
        const tenants = await db.tenants.findAll();
        tenants.forEach(t => console.log(`Tenant: ${t.id} - ${t.nombre}`));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
listTenants();
