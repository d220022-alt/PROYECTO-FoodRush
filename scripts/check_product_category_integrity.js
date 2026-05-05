/*
  Guia rapida para presentar:
  Script de mantenimiento o carga de datos: Check Product Category Integrity. Se usa para revisar, migrar o sembrar informacion durante pruebas y despliegues.
  Buscar en VS Code: script check_product_category_integrity, seed, diagnostico, migracion, Render, datos prueba.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
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
