/*
  Guia rapida para presentar:
  Script de mantenimiento o carga de datos: Init Payment Methods. Se usa para revisar, migrar o sembrar informacion durante pruebas y despliegues.
  Buscar en VS Code: script init_payment_methods, seed, diagnostico, migracion, Render, datos prueba.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const db = require('../models');

async function initPaymentMethods() {
    try {
        console.log('💳 Checking Payment Methods...');

        const count = await db.metodospago.count();
        console.log(`   Found ${count} existing methods.`);

        if (count === 0) {
            console.log('   🌱 Seeding Payment Methods...');
            await db.metodospago.bulkCreate([
                { id: 1, codigo: 'CASH', nombre: 'Efectivo', activo: true },
                { id: 2, codigo: 'CARD', nombre: 'Tarjeta de Crédito/Débito', activo: true },
                { id: 3, codigo: 'PAYPAL', nombre: 'PayPal', activo: true }
            ]);
            console.log('   ✅ Payment Methods Created (IDs 1, 2, 3)');
        } else {
            console.log('   ✅ Payment methods already exist.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error initializing payment methods:', error);
        process.exit(1);
    }
}

initPaymentMethods();
