/*
  Guia rapida para presentar:
  Script de mantenimiento o carga de datos: Force Create Categories. Se usa para revisar, migrar o sembrar informacion durante pruebas y despliegues.
  Buscar en VS Code: script force_create_categories, seed, diagnostico, migracion, Render, datos prueba.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const db = require('../models');

async function forceCreate() {
    try {
        console.log('🔨 Forcing Category Creation...');

        // 1. Get Starbucks Tenant (ID 25 based on previous logs, but let's find it)
        const tenant = await db.tenants.findOne({ where: { nombre: 'Starbucks' } });
        if (!tenant) throw new Error("Starbucks tenant not found");

        console.log(`✅ Using Tenant: ${tenant.nombre} (ID: ${tenant.id})`);

        // 2. Define Categories
        const cats = ['Bebidas', 'Comida', 'Café en Casa'];

        for (const name of cats) {
            const [cat, created] = await db.categorias.findOrCreate({
                where: {
                    nombre: name,
                    tenant_id: tenant.id
                },
                defaults: {
                    descripcion: `Categoría ${name}`
                }
            });
            console.log(`   📂 ${name}: ${created ? 'CREATED' : 'EXISTS'} (ID: ${cat.id})`);
        }

        console.log('✅ Categories Verified.');
        process.exit(0);

    } catch (e) {
        console.error('❌ Error:', e);
        process.exit(1);
    }
}
forceCreate();
