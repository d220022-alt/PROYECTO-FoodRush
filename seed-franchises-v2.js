/*
  Guia rapida para presentar:
  Script de mantenimiento o carga de datos: Seed Franchises V2. Se usa para revisar, migrar o sembrar informacion durante pruebas y despliegues.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const { tenants } = require('./models');
const { sequelize } = require('./models');

const data = [
    { name: "Starbucks Coffee", code: "SBUX" },
    { name: "McDonald's", code: "MCD" },
    { name: "KFC", code: "KFC" },
    { name: "Burger King", code: "BK" },
    { name: "Little Caesars", code: "LC" },
    { name: "Domino's Pizza", code: "DP" },
    { name: "Pizza Hut", code: "PH" },
    { name: "Krispy Kreme", code: "KK" },
    { name: "Rico Hot Dog", code: "RHD" },
    { name: "Pizzarelli", code: "PZZ" },
    { name: "Barra Payán", code: "BP" },
    { name: "Taco Bell", code: "TB" },
    { name: "Helados Bon", code: "HB" },
    { name: "Chili's Grill & Bar", code: "CHILIS" },
    { name: "Panda Express", code: "PE" }
];

async function seed() {
    try {
        console.log('🌱 Iniciando seeding de franquicias...');

        // Limpiar tabla (opcional, pero util para no duplicar si corro varias veces)
        // await tenants.destroy({ where: {}, truncate: true, cascade: true }); 
        // Comentado para ser seguro, mejor usamos findOrCreate

        for (const item of data) {
            const [tenant, created] = await tenants.findOrCreate({
                where: { nombre: item.name },
                defaults: {
                    nombre: item.name,
                    codigo: item.code,
                    activo: true
                }
            });

            if (created) console.log(`✅ Creado: ${item.name}`);
            else console.log(`⚠️  Ya existía: ${item.name}`);
        }

        console.log('✅ Seeding completado.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error en seeding:', error);
        process.exit(1);
    }
}

seed();
