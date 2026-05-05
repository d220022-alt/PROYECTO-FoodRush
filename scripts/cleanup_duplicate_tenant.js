/*
  Guia rapida para presentar:
  Script de mantenimiento o carga de datos: Cleanup Duplicate Tenant. Se usa para revisar, migrar o sembrar informacion durante pruebas y despliegues.
  Buscar en VS Code: script cleanup_duplicate_tenant, seed, diagnostico, migracion, Render, datos prueba.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const { Client } = require('pg');
require('dotenv').config({ path: '../.env' }); // Load env from root

async function cleanup() {
    // Configurar cliente PG usando .env
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
    });

    try {
        await client.connect();
        console.log('🔌 Conectado a BD via pg-native');
        console.log('🧹 Eliminando tenant "Starbucks" (duplicado)...');

        // Usar nombre exacto para borrar
        const res = await client.query("DELETE FROM tenants WHERE nombre = 'Starbucks' RETURNING *");

        if (res.rowCount > 0) {
            console.log(`✅ Tenant eliminado: ${res.rows[0].nombre} (ID: ${res.rows[0].id})`);
        } else {
            console.log('⚠️ No se encontró "Starbucks" (o ya fue borrado). Solo queda "Starbucks Coffee".');
        }

        await client.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

cleanup();
