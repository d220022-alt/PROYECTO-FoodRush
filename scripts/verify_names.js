/*
  Guia rapida para presentar:
  Script de mantenimiento o carga de datos: Verify Names. Se usa para revisar, migrar o sembrar informacion durante pruebas y despliegues.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const db = require('../models');

async function checkNames() {
    const tenants = await db.tenants.findAll();
    console.log('--- DB NAMES (Copy these exactly) ---');
    tenants.forEach(t => {
        console.log(`"${t.nombre}"`);
    });
    process.exit(0);
}

checkNames();
