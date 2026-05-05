/*
  Guia rapida para presentar:
  Script de mantenimiento o carga de datos: Fix Database Correct Order. Se usa para revisar, migrar o sembrar informacion durante pruebas y despliegues.
  Buscar en VS Code: script fix_database_correct_order, seed, diagnostico, migracion, Render, datos prueba.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const db = require('../models');

const CORRECT_FRANCHISES = [
    "Starbucks Coffee",
    "McDonald's",
    "KFC",
    "Burger King",
    "Little Caesars",
    "Domino's Pizza",
    "Pizza Hut",
    "Krispy Kreme",
    "Rico Hot Dog",
    "Pizzarelli",
    "Barra Payán",
    "Taco Bell",
    "Helados Bon",
    "Chili's Grill & Bar",
    "Panda Express"
];

async function fixDatabase() {
    const transaction = await db.sequelize.transaction();
    try {
        console.log('⚠️ DELETING existing tenants to restore order (CASCADE)...');
        // Using TRUNCATE CASCADE to clear tenants and their related products/orders
        await db.sequelize.query('TRUNCATE TABLE tenants RESTART IDENTITY CASCADE;', { transaction });

        console.log('✅ Inserting correct franchises in order...');
        for (const name of CORRECT_FRANCHISES) {
            await db.tenants.create({
                nombre: name,
                direccion: "Dirección Principal",
                telefono: "809-555-5555",
                estado: "activo"
            }, { transaction });
            console.log(`   + Created: ${name}`);
        }

        await transaction.commit();
        console.log('🎉 Database fixed! Tenants are now 1-15 in correct order.');
        process.exit(0);

    } catch (error) {
        await transaction.rollback();
        console.error('❌ Error fixing database:', error);
        process.exit(1);
    }
}

fixDatabase();
