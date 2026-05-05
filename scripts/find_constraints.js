/*
  Guia rapida para presentar:
  Script de mantenimiento o carga de datos: Find Constraints. Se usa para revisar, migrar o sembrar informacion durante pruebas y despliegues.
  Buscar en VS Code: script find_constraints, seed, diagnostico, migracion, Render, datos prueba.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const { Client } = require('pg');
require('dotenv').config();

async function findConstraints() {
    const client = new Client({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || '127.0.0.1',
        database: process.env.DB_NAME || 'FoodRushMultiTenant',
        password: process.env.DB_PASS || process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT) || 5432,
    });

    try {
        await client.connect();
        const res = await client.query("SELECT table_name, constraint_name FROM information_schema.table_constraints WHERE constraint_name LIKE '%producto%'");
        console.log('🔗 Constraints de Productos:');
        console.log(res.rows.map(r => `${r.table_name} -> ${r.constraint_name}`).join('\n'));
        await client.end();
    } catch (e) {
        console.error(e);
    }
}

findConstraints();
