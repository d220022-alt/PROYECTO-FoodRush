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
