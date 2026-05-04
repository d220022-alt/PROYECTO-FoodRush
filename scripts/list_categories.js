/*
  Guia rapida para presentar:
  Script de mantenimiento o carga de datos: List Categories. Se usa para revisar, migrar o sembrar informacion durante pruebas y despliegues.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const db = require('../models');

async function listCats() {
    try {
        const cats = await db.categorias.findAll();
        cats.forEach(c => console.log(`Category ID ${c.id}: '${c.nombre}' (Tenant ${c.tenant_id})`));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
listCats();
