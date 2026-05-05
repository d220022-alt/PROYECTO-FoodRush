/*
  Guia rapida para presentar:
  Script de mantenimiento o carga de datos: List Schema. Se usa para revisar, migrar o sembrar informacion durante pruebas y despliegues.
  Buscar en VS Code: script list_schema, seed, diagnostico, migracion, Render, datos prueba.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const { sequelize } = require('../models');

async function listSchema() {
    try {
        const queryInterface = sequelize.getQueryInterface();
        const description = await queryInterface.describeTable('pedidos');
        console.log('PEDIDOS_COLUMNS_START');
        console.log(JSON.stringify(Object.keys(description)));
        console.log('PEDIDOS_COLUMNS_END');
    } catch (error) {
        console.error('Error listing schema:', error);
    } finally {
        process.exit(0);
    }
}

listSchema();
