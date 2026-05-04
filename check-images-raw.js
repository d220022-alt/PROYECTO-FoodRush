/*
  Guia rapida para presentar:
  Script de mantenimiento o carga de datos: Check Images Raw. Se usa para revisar, migrar o sembrar informacion durante pruebas y despliegues.
  Mantener estos comentarios actualizados si cambia el flujo.
*/

const db = require('./models');

async function checkImages() {
    try {
        await db.sequelize.authenticate();
        // Raw query to bypass model quirks
        const [results] = await db.sequelize.query('SELECT id, nombre, img FROM productos WHERE tenant_id = 2');

        console.log('Current Database Images for Tenant 2 (Raw SQL):');
        results.forEach(p => console.log(`${p.nombre}: ${p.img}`));

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkImages();
