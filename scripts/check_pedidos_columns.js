/*
  Guia rapida para presentar:
  Script de mantenimiento o carga de datos: Check Pedidos Columns. Se usa para revisar, migrar o sembrar informacion durante pruebas y despliegues.
  Buscar en VS Code: script check_pedidos_columns, seed, diagnostico, migracion, Render, datos prueba.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const { sequelize } = require('../models');

async function checkColumns() {
    try {
        console.log('🔍 Querying columns for table "pedidos"...');
        const [results, metadata] = await sequelize.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'pedidos';
        `);
        console.log('COLUMNS:', JSON.stringify(results.map(r => r.column_name)));
    } catch (error) {
        console.error('Error querying columns:', error);
    } finally {
        process.exit(0);
    }
}

checkColumns();
