/*
  Guia rapida para presentar:
  Script de mantenimiento o carga de datos: Check Tenants. Se usa para revisar, migrar o sembrar informacion durante pruebas y despliegues.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const db = require('../models');

async function listTenants() {
    try {
        const tenants = await db.tenants.findAll();
        tenants.forEach(t => console.log(`Tenant: ${t.id} - ${t.nombre}`));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
listTenants();
