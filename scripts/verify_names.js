const db = require('../models');

async function checkNames() {
    const tenants = await db.tenants.findAll();
    console.log('--- DB NAMES (Copy these exactly) ---');
    tenants.forEach(t => {
        console.log(`"${t.nombre}"`);
    });
    process.exit(0);
}

checkNames();
