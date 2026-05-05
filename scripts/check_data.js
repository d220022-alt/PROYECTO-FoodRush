/*
  Guia rapida para presentar:
  Script de mantenimiento o carga de datos: Check Data. Se usa para revisar, migrar o sembrar informacion durante pruebas y despliegues.
  Buscar en VS Code: script check_data, seed, diagnostico, migracion, Render, datos prueba.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const db = require('../models');

async function checkData() {
    try {
        console.log('🔍 Checking Categories...');
        const categories = await db.categorias.findAll();
        categories.forEach(c => console.log(`   📂 Category ID ${c.id}: ${c.nombre}`));

        console.log('\n🔍 Checking Products...');
        const products = await db.productos.findAll({
            include: [{ model: db.categorias, as: 'categoria' }]
        });

        if (products.length === 0) console.log('   ❌ No products found in DB.');

        products.forEach(p => {
            console.log(`   ☕ Product ID ${p.id}: ${p.nombre} | Category: ${p.categoria ? p.categoria.nombre : 'NULL'}`);
        });

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
checkData();
