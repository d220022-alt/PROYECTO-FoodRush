/*
  Guia rapida para presentar:
  Script de mantenimiento o carga de datos: Seed States. Se usa para revisar, migrar o sembrar informacion durante pruebas y despliegues.
  Mantener estos comentarios actualizados si cambia el flujo.
*/

const db = require('./models');

async function seedStates() {
    try {
        await db.sequelize.authenticate();

        const states = [
            { id: 1, codigo: 'PENDING', descripcion: 'Pendiente' },
            { id: 2, codigo: 'PREPARING', descripcion: 'Preparando' },
            { id: 3, codigo: 'SHIPPING', descripcion: 'En Camino' },
            { id: 4, codigo: 'DELIVERED', descripcion: 'Entregado' },
            { id: 5, codigo: 'CANCELLED', descripcion: 'Cancelado' }
        ];

        for (const state of states) {
            await db.estadospedidos.upsert(state);
        }

        console.log('✅ Estados upserted correctly');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding states:', error);
        process.exit(1);
    }
}

seedStates();
