const db = require('../models');

const starbucksProducts = [
    { id: 1, name: "Iced Black Tea", category: "Bebidas", type: "Té Negro", price: 15, caffeinated: true, img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop" },
    { id: 2, name: "Hot Chai Tea", category: "Bebidas", type: "Té Negro", price: 31, caffeinated: true, img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop" },
    { id: 3, name: "Cold Brew", category: "Bebidas", type: "Café", price: 12, caffeinated: true, img: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=800&auto=format&fit=crop" },
    { id: 4, name: "Caffè Americano", category: "Bebidas", type: "Café", price: 12, caffeinated: true, img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop" },
    { id: 5, name: "Matcha Latte", category: "Bebidas", type: "Té Verde", price: 10, caffeinated: true, img: "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?q=80&w=800&auto=format&fit=crop" },
    { id: 6, name: "Mocha Frappuccino", category: "Bebidas", type: "Café", price: 10, caffeinated: true, img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=800&auto=format&fit=crop" },
    { id: 7, name: "Hot Chocolate", category: "Bebidas", type: "Chocolate", price: 12, caffeinated: false, img: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?q=80&w=800&auto=format&fit=crop" },
    { id: 8, name: "Berry Refresher", category: "Bebidas", type: "Refresher", price: 17, caffeinated: true, img: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=800&auto=format&fit=crop" },
    { id: 9, name: "Croissant de Jamón", category: "Comida", type: "Panadería", price: 5, caffeinated: false, img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop" },
    { id: 10, name: "Cake Pop", category: "Comida", type: "Panadería", price: 3, caffeinated: false, img: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=800&auto=format&fit=crop" },
    { id: 11, name: "Sandwich de Pollo", category: "Comida", type: "Almuerzo", price: 8, caffeinated: false, img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=800&auto=format&fit=crop" },
    { id: 12, name: "Café en Grano", category: "Café en Casa", type: "Granos", price: 25, caffeinated: true, img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800&auto=format&fit=crop" },
    { id: 13, name: "Decaf Espresso", category: "Café en Casa", type: "Granos", price: 24, caffeinated: false, img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop" }
];

async function seed() {
    try {
        console.log('🌱 Starting Seed Process...');

        // 1. Find or Create Tenant 'Starbucks'
        const [tenant] = await db.tenants.findOrCreate({
            where: { nombre: 'Starbucks' },
            defaults: {
                nombre: 'Starbucks',
                codigo: 'STB001',
                activo: true,
                contacto: 'contact@starbucks.com'
            }
        });
        console.log(`✅ Using Tenant: ${tenant.nombre} (ID: ${tenant.id})`);

        // 2. Iterate and Create Products
        for (const p of starbucksProducts) {

            // Find or Create Category
            const [category] = await db.categorias.findOrCreate({
                where: {
                    nombre: p.category,
                    tenant_id: tenant.id
                },
                defaults: {
                    descripcion: `Categoría para ${p.category}`
                }
            });

            // Create Product
            let product = await db.productos.findOne({
                where: {
                    nombre: p.name,
                    tenant_id: tenant.id
                }
            });

            let created = false;
            if (!product) {
                product = await db.productos.create({
                    tenant_id: tenant.id,
                    categoria_id: category.id,
                    nombre: p.name,
                    descripcion: `${p.type} - ${p.caffeinated ? 'Con Cafeína' : 'Sin Cafeína'}`,
                    precio: p.price,
                    activo: true
                });
                console.log(`   ➕ Created Product: ${p.name}`);
                created = true;
            } else {
                console.log(`   🔹 Product exists: ${p.name}`);
                // Optional Update logic
                if (product.precio !== p.precio || product.descripcion !== `${p.type} - ${p.caffeinated ? 'Con Cafeína' : 'Sin Cafeína'}`) {
                    product.precio = p.precio;
                    product.descripcion = `${p.type} - ${p.caffeinated ? 'Con Cafeína' : 'Sin Cafeína'}`;
                    await product.save();
                    console.log(`      Updated Price/Desc`);
                }
            }

            // Handle Image
            // Check if image exists
            const image = await db.productos_imagenes.findOne({
                where: {
                    producto_id: product.id,
                    tenant_id: tenant.id
                }
            });

            if (!image) {
                await db.productos_imagenes.create({
                    producto_id: product.id,
                    tenant_id: tenant.id,
                    imagen_url: p.img,
                    orden: 0
                });
                console.log(`      📸 Image Linked`);
            } else {
                if (image.imagen_url !== p.img) {
                    image.imagen_url = p.img;
                    await image.save();
                    console.log(`      🔄 Image Updated`);
                }
            }
        }

        console.log('✅ Seeding Complete! Database is now in sync with Frontend.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    }
}

seed();
