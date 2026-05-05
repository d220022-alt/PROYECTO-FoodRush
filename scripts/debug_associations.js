/*
  Guia rapida para presentar:
  Script de mantenimiento o carga de datos: Debug Associations. Se usa para revisar, migrar o sembrar informacion durante pruebas y despliegues.
  Buscar en VS Code: script debug_associations, seed, diagnostico, migracion, Render, datos prueba.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const db = require('../models');

async function debugAssoc() {
    try {
        console.log('🔍 DB Models:', Object.keys(db).sort());

        const Product = db.productos;
        const Image = db.productos_imagenes;

        console.log('🔍 Product Model:', Product ? 'FOUND' : 'MISSING');
        console.log('🔍 Image Model:', Image ? 'FOUND' : 'MISSING');

        if (!Product) return;

        console.log('🔍 Product Associations:', Object.keys(Product.associations));

        if (Product.associations.imagenes) {
            console.log('✅ Association [imagenes] EXISTS.');
            console.log('   Target:', Product.associations.imagenes.target.name);
            console.log('   Alias:', Product.associations.imagenes.as);
        } else {
            console.error('❌ Association [imagenes] MISSING.');
        }

        process.exit(0);

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
debugAssoc();
