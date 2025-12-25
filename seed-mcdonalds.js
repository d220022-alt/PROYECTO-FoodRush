
const db = require('./models');

async function seedMcDonalds() {
    try {
        await db.sequelize.authenticate();
        console.log('✅ Connected to DB');

        const products = [
            {
                tenant_id: 2,
                nombre: 'Big Mac',
                descripcion: 'Hamburguesas - La clásica hamburguesa doble con salsa especial',
                precio: 350.00,
                activo: true,
                img: 'https://s7d1.scene7.com/is/image/mcdonalds/DC_201907_0005_BigMac_832x472:product-header-desktop?wid=830&hei=458&dpr=off'
            },
            {
                tenant_id: 2,
                nombre: 'McNuggets 10 pzas',
                descripcion: 'Complementos - Crujientes trozos de pollo',
                precio: 250.00,
                activo: true,
                img: 'https://s7d1.scene7.com/is/image/mcdonalds/DC_202006_0483_McNuggets_10pc_832x472:product-header-desktop?wid=830&hei=458&dpr=off'
            },
            {
                tenant_id: 2,
                nombre: 'Papas Fritas Medianas',
                descripcion: 'Complementos - Las papas más famosas del mundo',
                precio: 150.00,
                activo: true,
                img: 'https://s7d1.scene7.com/is/image/mcdonalds/DC_202002_6050_SmallFrenchFries_Standing_832x472:product-header-desktop?wid=830&hei=458&dpr=off'
            },
            {
                tenant_id: 2,
                nombre: 'McFlurry Oreo',
                descripcion: 'Postres - Helado de vainilla con trozos de galleta',
                precio: 200.00,
                activo: true,
                img: 'https://s7d1.scene7.com/is/image/mcdonalds/DC_202002_3832_OreoMcFlurry_832x472:product-header-desktop?wid=830&hei=458&dpr=off'
            },
            {
                tenant_id: 2,
                nombre: 'Cuarto de Libra con Queso',
                descripcion: 'Hamburguesas - Carne pura de res y queso cheddar',
                precio: 380.00,
                activo: true,
                img: 'https://s7d1.scene7.com/is/image/mcdonalds/DC_202201_0007-425_QuarterPounderwithCheese_832x472:product-header-desktop?wid=830&hei=458&dpr=off'
            },
            {
                tenant_id: 2,
                nombre: 'Coca-Cola Media',
                descripcion: 'Bebidas - Refrescante sabor original',
                precio: 100.00,
                activo: true,
                img: 'https://s7d1.scene7.com/is/image/mcdonalds/DC_201906_1113_MediumCoke_Glass_832x472:product-header-desktop?wid=830&hei=458&dpr=off'
            }
        ];

        // Clear existing dummy products for tenant 2 if generic
        // We update existing logic to prioritize updating images
        for (const p of products) {
            // Upsert by name to avoid duplicates if re-run
            const existing = await db.productos.findOne({ where: { tenant_id: 2, nombre: p.nombre } });
            if (!existing) {
                await db.productos.create(p);
            } else {
                // Force update fields including img
                await existing.update(p);
            }
        }

        console.log('✅ McDonalds products seeded with REAL images');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding McDonalds:', error);
        process.exit(1);
    }
}

seedMcDonalds();
