/**
 * Seed para FoodRush - Crea las franquicias que el frontend espera
 * Ejecutar con: DATABASE_URL=... NODE_ENV=production node seed-franchises-frontend.js
 */
require('dotenv').config();
const db = require('./models');

const FRANCHISES = [
    { nombre: "Starbucks Coffee", codigo: "starbucks", contacto: "starbucks@foodrush.com" },
    { nombre: "McDonald's", codigo: "mcdonalds", contacto: "mcdonalds@foodrush.com" },
    { nombre: "KFC", codigo: "kfc", contacto: "kfc@foodrush.com" },
    { nombre: "Burger King", codigo: "burgerking", contacto: "burgerking@foodrush.com" },
    { nombre: "Little Caesars", codigo: "littlecaesars", contacto: "littlecaesars@foodrush.com" },
    { nombre: "Domino's Pizza", codigo: "dominos", contacto: "dominos@foodrush.com" },
    { nombre: "Pizza Hut", codigo: "pizzahut", contacto: "pizzahut@foodrush.com" },
    { nombre: "Krispy Kreme", codigo: "krispykreme", contacto: "krispykreme@foodrush.com" },
    { nombre: "Rico Hot Dog", codigo: "ricohotdog", contacto: "ricohotdog@foodrush.com" },
    { nombre: "Pizzarelli", codigo: "pizzarelli", contacto: "pizzarelli@foodrush.com" },
    { nombre: "Barra Payán", codigo: "barrapayan", contacto: "barrapayan@foodrush.com" },
    { nombre: "Taco Bell", codigo: "tacobell", contacto: "tacobell@foodrush.com" },
    { nombre: "Helados Bon", codigo: "heladosbon", contacto: "heladosbon@foodrush.com" },
    { nombre: "Chili's Grill & Bar", codigo: "chilis", contacto: "chilis@foodrush.com" },
    { nombre: "Panda Express", codigo: "pandaexpress", contacto: "pandaexpress@foodrush.com" }
];

async function seedFranchises() {
    try {
        await db.sequelize.authenticate();
        console.log('✅ Conectado a la BD');

        // Buscar el modelo de tenants
        const Tenant = db.tenants || db.Tenant || db.Tenants;
        if (!Tenant) {
            console.error('❌ No se encontró el modelo de tenants. Modelos disponibles:', Object.keys(db).filter(k => k !== 'sequelize' && k !== 'Sequelize'));
            process.exit(1);
        }

        console.log(`📊 Modelo encontrado: ${Tenant.name}, tabla: ${Tenant.tableName}`);

        // Limpiar tenants existentes del seed genérico
        const existingCount = await Tenant.count();
        if (existingCount > 0) {
            console.log(`🗑️  Limpiando ${existingCount} registros existentes...`);
            await Tenant.destroy({ where: {}, truncate: true, cascade: true });
        }

        // Insertar franquicias
        console.log(`🌱 Insertando ${FRANCHISES.length} franquicias...`);
        for (const franchise of FRANCHISES) {
            try {
                await Tenant.create({
                    ...franchise,
                    activo: true
                });
                console.log(`   ✅ ${franchise.nombre}`);
            } catch (err) {
                console.error(`   ❌ Error con ${franchise.nombre}:`, err.message);
            }
        }

        // Verificar
        const finalCount = await Tenant.count();
        console.log(`\n🎉 ¡Listo! ${finalCount} franquicias en la BD.`);

        // Mostrar lo que hay
        const all = await Tenant.findAll({ attributes: ['id', 'nombre', 'codigo'] });
        console.log('\n📋 Franquicias cargadas:');
        all.forEach(t => console.log(`   ${t.id}: ${t.nombre} (${t.codigo})`));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error fatal:', error);
        process.exit(1);
    }
}

seedFranchises();
