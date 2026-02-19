/**
 * SEED v2 - FoodRush
 * Datos alineados con lo que el frontend espera.
 * 
 * STARBUCKS: Categorías → "Bebidas", "Comida", "Café en Casa"
 * McDONALDS: Descripción formato → "Categoría - descripción real"
 *            Categorías UI → "Hamburguesas", "Complementos", "Bebidas", "Postres"
 *
 * Ejecutar: $env:DATABASE_URL='...'; $env:NODE_ENV='production'; node seed-v2-aligned.js
 */
require('dotenv').config();
const db = require('./models');

const FRANCHISE_DATA = {
    "Starbucks Coffee": {
        // Starbucks.vue tabs: "Bebidas", "Comida", "Café en Casa"
        categorias: ["Bebidas", "Comida", "Café en Casa"],
        productos: [
            // Bebidas
            { nombre: "Caramel Macchiato", descripcion: "Espresso con leche vaporizada y caramelo - Con Cafeína", precio: 280, cat: "Bebidas" },
            { nombre: "Café Americano", descripcion: "Espresso con agua caliente - Con Cafeína", precio: 180, cat: "Bebidas" },
            { nombre: "Cappuccino", descripcion: "Espresso con espuma de leche cremosa - Con Cafeína", precio: 250, cat: "Bebidas" },
            { nombre: "Latte Vainilla", descripcion: "Espresso con leche y sirope de vainilla - Con Cafeína", precio: 270, cat: "Bebidas" },
            { nombre: "Iced Coffee", descripcion: "Café helado con hielo y leche - Con Cafeína", precio: 220, cat: "Bebidas" },
            { nombre: "Cold Brew", descripcion: "Café extraído en frío 20 horas - Con Cafeína", precio: 260, cat: "Bebidas" },
            { nombre: "Mocha Frappuccino", descripcion: "Frappuccino de chocolate y café - Con Cafeína", precio: 320, cat: "Bebidas" },
            { nombre: "Java Chip Frappuccino", descripcion: "Frappuccino con chips de chocolate - Con Cafeína", precio: 340, cat: "Bebidas" },
            { nombre: "Strawberry Frappuccino", descripcion: "Frappuccino de fresa y crema sin café - Sin Cafeína", precio: 310, cat: "Bebidas" },
            { nombre: "Chocolate Caliente", descripcion: "Chocolate caliente con crema batida - Sin Cafeína", precio: 240, cat: "Bebidas" },
            // Comida
            { nombre: "Croissant de Jamón y Queso", descripcion: "Croissant horneado relleno", precio: 195, cat: "Comida" },
            { nombre: "Muffin de Chocolate", descripcion: "Muffin esponjoso con chips de chocolate", precio: 175, cat: "Comida" },
            { nombre: "Cheesecake New York", descripcion: "Rebanada de cheesecake clásico", precio: 250, cat: "Comida" },
            { nombre: "Bagel con Queso Crema", descripcion: "Bagel fresco con queso crema Philadelphia", precio: 180, cat: "Comida" },
            { nombre: "Wrap de Pollo", descripcion: "Tortilla de harina con pollo y vegetales", precio: 280, cat: "Comida" },
            // Café en Casa
            { nombre: "Starbucks House Blend", descripcion: "Café molido House Blend 250g", precio: 450, cat: "Café en Casa" },
            { nombre: "Pike Place Roast", descripcion: "Café molido tostado medio 250g", precio: 480, cat: "Café en Casa" },
            { nombre: "Veranda Blend", descripcion: "Café molido tostado suave rubio 250g", precio: 420, cat: "Café en Casa" },
        ]
    },
    "McDonald's": {
        // McDonalds.vue tabs: "Hamburguesas", "Complementos", "Bebidas", "Postres"
        // McDonalds.vue parsea: descripcion.split(' - ') → [0]=categoría, [1]=descripción
        categorias: ["Hamburguesas", "Complementos", "Bebidas", "Postres"],
        productos: [
            // Hamburguesas
            { nombre: "Big Mac", descripcion: "Hamburguesas - Dos hamburguesas con salsa especial, lechuga y queso", precio: 350, cat: "Hamburguesas" },
            { nombre: "Cuarto de Libra con Queso", descripcion: "Hamburguesas - Hamburguesa 1/4 lb con queso americano", precio: 320, cat: "Hamburguesas" },
            { nombre: "McPollo", descripcion: "Hamburguesas - Pechuga empanizada con mayo y lechuga", precio: 280, cat: "Hamburguesas" },
            { nombre: "Big Mac Doble", descripcion: "Hamburguesas - Doble carne con salsa especial", precio: 450, cat: "Hamburguesas" },
            { nombre: "McNifica", descripcion: "Hamburguesas - Hamburguesa premium con carne angus", precio: 420, cat: "Hamburguesas" },
            // Complementos
            { nombre: "Papas Fritas Medianas", descripcion: "Complementos - Papas fritas crujientes tamaño mediano", precio: 150, cat: "Complementos" },
            { nombre: "McNuggets 10pc", descripcion: "Complementos - 10 piezas de nuggets crujientes", precio: 310, cat: "Complementos" },
            { nombre: "Cajita Feliz", descripcion: "Complementos - Hamburguesa pequeña + papas + jugo + juguete", precio: 350, cat: "Complementos" },
            // Bebidas
            { nombre: "Coca-Cola Grande", descripcion: "Bebidas - Coca-Cola 32oz", precio: 120, cat: "Bebidas" },
            { nombre: "Sprite Grande", descripcion: "Bebidas - Sprite refrescante 32oz", precio: 120, cat: "Bebidas" },
            { nombre: "Malteada de Chocolate", descripcion: "Bebidas - Malteada espesa de chocolate", precio: 220, cat: "Bebidas" },
            // Postres
            { nombre: "McFlurry Oreo", descripcion: "Postres - Helado con trozos de Oreo", precio: 220, cat: "Postres" },
            { nombre: "McFlurry M&M", descripcion: "Postres - Helado con M&M's de colores", precio: 220, cat: "Postres" },
            { nombre: "Hotcakes", descripcion: "Postres - 3 hotcakes con mantequilla y sirope", precio: 250, cat: "Postres" },
            { nombre: "Pie de Manzana", descripcion: "Postres - Pay crujiente relleno de manzana", precio: 100, cat: "Postres" },
        ]
    },
    "KFC": {
        categorias: ["Pollo", "Combos", "Complementos", "Bebidas"],
        productos: [
            { nombre: "Bucket 8 Piezas", descripcion: "8 piezas de pollo original crujiente", precio: 750, cat: "Pollo" },
            { nombre: "Bucket 12 Piezas", descripcion: "12 piezas de pollo original crujiente", precio: 1050, cat: "Pollo" },
            { nombre: "Popcorn Chicken", descripcion: "Trozos de pollo crujiente en balde", precio: 280, cat: "Pollo" },
            { nombre: "Combo Crunch", descripcion: "2 piezas + papas + bebida + galleta", precio: 420, cat: "Combos" },
            { nombre: "Combo Familiar", descripcion: "8 piezas + 2 papas + ensalada + bebidas", precio: 1250, cat: "Combos" },
            { nombre: "Papas Fritas Grandes", descripcion: "Papas fritas kentucky grandes", precio: 180, cat: "Complementos" },
            { nombre: "Ensalada Coleslaw", descripcion: "Ensalada de repollo cremosa", precio: 130, cat: "Complementos" },
            { nombre: "Limonada KFC", descripcion: "Limonada natural grande", precio: 120, cat: "Bebidas" },
        ]
    },
    "Burger King": {
        categorias: ["Whoppers", "Combos", "Pollo", "Postres"],
        productos: [
            { nombre: "Whopper", descripcion: "Hamburguesa a la parrilla con vegetales frescos", precio: 350, cat: "Whoppers" },
            { nombre: "Whopper con Queso", descripcion: "Whopper clásico con queso americano", precio: 380, cat: "Whoppers" },
            { nombre: "Double Whopper", descripcion: "Doble carne a la parrilla", precio: 480, cat: "Whoppers" },
            { nombre: "Combo Whopper", descripcion: "Whopper + papas + bebida", precio: 520, cat: "Combos" },
            { nombre: "Chicken Fries", descripcion: "Tiras de pollo empanizado crujiente", precio: 250, cat: "Pollo" },
            { nombre: "Sundae de Chocolate", descripcion: "Helado suave con sirope de chocolate", precio: 150, cat: "Postres" },
        ]
    },
    "Little Caesars": {
        categorias: ["Pizzas", "Complementos", "Bebidas"],
        productos: [
            { nombre: "Hot-N-Ready Pepperoni", descripcion: "Pizza grande de pepperoni lista para llevar", precio: 399, cat: "Pizzas" },
            { nombre: "ExtraMostBestest", descripcion: "Pizza con extra queso y pepperoni", precio: 499, cat: "Pizzas" },
            { nombre: "3 Meat Treat", descripcion: "Pizza con pepperoni, salchicha y tocino", precio: 549, cat: "Pizzas" },
            { nombre: "Italian Cheese Bread", descripcion: "Pan con queso italiano", precio: 220, cat: "Complementos" },
            { nombre: "Crazy Bread", descripcion: "Palitos de pan con ajo y parmesano", precio: 180, cat: "Complementos" },
            { nombre: "Pepsi 2L", descripcion: "Pepsi de 2 litros", precio: 130, cat: "Bebidas" },
        ]
    },
    "Domino's Pizza": {
        categorias: ["Pizzas", "Complementos", "Bebidas"],
        productos: [
            { nombre: "Pepperoni Clásica", descripcion: "Pizza con abundante pepperoni", precio: 450, cat: "Pizzas" },
            { nombre: "Hawaiana", descripcion: "Jamón, piña y queso mozzarella", precio: 480, cat: "Pizzas" },
            { nombre: "MeatZZa", descripcion: "Pepperoni, salchicha, carne y jamón", precio: 550, cat: "Pizzas" },
            { nombre: "ExtravaganZZa", descripcion: "Con todo: pepperoni, jamón, carne, olivas, pimiento", precio: 599, cat: "Pizzas" },
            { nombre: "Cheesy Bread", descripcion: "Pan con queso fundido", precio: 250, cat: "Complementos" },
            { nombre: "Lava Cake", descripcion: "Pastel de chocolate fundido", precio: 220, cat: "Complementos" },
            { nombre: "Coca-Cola 2L", descripcion: "Coca-Cola de 2 litros", precio: 130, cat: "Bebidas" },
        ]
    },
    "Pizza Hut": {
        categorias: ["Pizzas", "Pastas", "Complementos"],
        productos: [
            { nombre: "Supreme Pan Pizza", descripcion: "Pizza pan con pepperoni, champiñones, pimiento", precio: 520, cat: "Pizzas" },
            { nombre: "Meat Lovers Pan", descripcion: "Pizza pan con carnes surtidas", precio: 560, cat: "Pizzas" },
            { nombre: "Margarita Delgada", descripcion: "Pizza masa delgada con tomate y albahaca", precio: 430, cat: "Pizzas" },
            { nombre: "Pasta Alfredo", descripcion: "Pasta con salsa alfredo y pollo", precio: 380, cat: "Pastas" },
            { nombre: "Breadsticks", descripcion: "Palitos de pan con salsa marinara", precio: 200, cat: "Complementos" },
        ]
    },
    "Krispy Kreme": {
        categorias: ["Donas", "Docenas", "Bebidas"],
        productos: [
            { nombre: "Original Glazed", descripcion: "Dona glaseada original", precio: 85, cat: "Donas" },
            { nombre: "Chocolate Iced Glazed", descripcion: "Dona glaseada con chocolate", precio: 95, cat: "Donas" },
            { nombre: "Strawberry Iced", descripcion: "Dona con glaseado de fresa y chispas", precio: 110, cat: "Donas" },
            { nombre: "Oreo Cookies & Kreme", descripcion: "Dona rellena de crema con Oreo", precio: 130, cat: "Donas" },
            { nombre: "Docena Original Glazed", descripcion: "12 donas glaseadas originales", precio: 750, cat: "Docenas" },
            { nombre: "Docena Surtida", descripcion: "12 donas variadas", precio: 950, cat: "Docenas" },
            { nombre: "Café Latte", descripcion: "Café latte cremoso", precio: 180, cat: "Bebidas" },
        ]
    },
    "Rico Hot Dog": {
        categorias: ["Hot Dogs", "Hamburguesas", "Complementos", "Bebidas"],
        productos: [
            { nombre: "Hot Dog Clásico", descripcion: "Salchicha con ketchup, mostaza y cebolla", precio: 150, cat: "Hot Dogs" },
            { nombre: "Hot Dog Especial", descripcion: "Salchicha con queso, tocineta y jalapeño", precio: 220, cat: "Hot Dogs" },
            { nombre: "Super Hot Dog", descripcion: "Doble salchicha con todos los toppings", precio: 280, cat: "Hot Dogs" },
            { nombre: "Hamburguesa Rico", descripcion: "Hamburguesa con queso y vegetales", precio: 250, cat: "Hamburguesas" },
            { nombre: "Papas Fritas", descripcion: "Papas fritas crujientes", precio: 120, cat: "Complementos" },
            { nombre: "Jugo Natural", descripcion: "Jugo de chinola o limón", precio: 100, cat: "Bebidas" },
        ]
    },
    "Pizzarelli": {
        categorias: ["Pizzas", "Calzones", "Pastas", "Ensaladas"],
        productos: [
            { nombre: "Pizza Margherita", descripcion: "Tomate San Marzano, mozzarella y albahaca", precio: 450, cat: "Pizzas" },
            { nombre: "Pizza Quattro Formaggi", descripcion: "Cuatro quesos: mozzarella, gorgonzola, parmesano", precio: 520, cat: "Pizzas" },
            { nombre: "Calzone Napolitano", descripcion: "Relleno de ricotta, jamón y champiñones", precio: 420, cat: "Calzones" },
            { nombre: "Penne Arrabbiata", descripcion: "Pasta con salsa picante de tomate", precio: 380, cat: "Pastas" },
            { nombre: "Ensalada Caesar", descripcion: "Lechuga romana, crutones, parmesano", precio: 280, cat: "Ensaladas" },
        ]
    },
    "Barra Payán": {
        categorias: ["Hamburguesas", "Especiales", "Picaderas", "Bebidas"],
        productos: [
            { nombre: "Chimi Clásico", descripcion: "El auténtico chimi dominicano con repollo", precio: 200, cat: "Hamburguesas" },
            { nombre: "Chimi Doble", descripcion: "Doble carne con queso y repollo", precio: 300, cat: "Hamburguesas" },
            { nombre: "Yaroa de Pollo", descripcion: "Papas, pollo, queso fundido y ketchup", precio: 350, cat: "Especiales" },
            { nombre: "Yaroa Mixta", descripcion: "Papas, carne, pollo, queso y salsas", precio: 400, cat: "Especiales" },
            { nombre: "Plátano Frito", descripcion: "Tostones crujientes", precio: 100, cat: "Picaderas" },
            { nombre: "Morir Soñando", descripcion: "Jugo de naranja con leche", precio: 130, cat: "Bebidas" },
        ]
    },
    "Taco Bell": {
        categorias: ["Tacos", "Burritos", "Combos", "Bebidas"],
        productos: [
            { nombre: "Crunchy Taco", descripcion: "Taco crujiente con carne, lechuga y queso", precio: 150, cat: "Tacos" },
            { nombre: "Taco Supreme", descripcion: "Taco supremo con crema agria y tomate", precio: 190, cat: "Tacos" },
            { nombre: "Burrito Supreme", descripcion: "Tortilla con carne, frijoles, arroz y queso", precio: 320, cat: "Burritos" },
            { nombre: "Crunchwrap Supreme", descripcion: "Tortilla crujiente envuelta con carne y nacho", precio: 380, cat: "Burritos" },
            { nombre: "Combo Taco Party", descripcion: "4 tacos + nachos + 2 bebidas", precio: 750, cat: "Combos" },
            { nombre: "Baja Blast", descripcion: "Mountain Dew Baja Blast exclusivo", precio: 110, cat: "Bebidas" },
        ]
    },
    "Helados Bon": {
        categorias: ["Helados", "Batidos", "Sundaes", "Postres"],
        productos: [
            { nombre: "Helado de Vainilla 2 bolas", descripcion: "Helado artesanal de vainilla", precio: 150, cat: "Helados" },
            { nombre: "Helado de Chocolate 2 bolas", descripcion: "Helado artesanal de chocolate belga", precio: 150, cat: "Helados" },
            { nombre: "Cookies & Cream", descripcion: "Helado con trozos de galleta Oreo", precio: 170, cat: "Helados" },
            { nombre: "Batido de Fresa", descripcion: "Batido cremoso de fresa natural", precio: 220, cat: "Batidos" },
            { nombre: "Banana Split", descripcion: "Banana con 3 bolas de helado y sirope", precio: 320, cat: "Sundaes" },
            { nombre: "Brownie con Helado", descripcion: "Brownie caliente con helado de vainilla", precio: 280, cat: "Postres" },
        ]
    },
    "Chili's Grill & Bar": {
        categorias: ["Entradas", "Hamburguesas", "Costillas", "Tex-Mex", "Postres"],
        productos: [
            { nombre: "Baby Back Ribs Full", descripcion: "Costillas completas con salsa BBQ", precio: 890, cat: "Costillas" },
            { nombre: "Baby Back Ribs Half", descripcion: "Media rack de costillas BBQ", precio: 590, cat: "Costillas" },
            { nombre: "Oldtimer Burger", descripcion: "Hamburguesa clásica americana con tocino", precio: 450, cat: "Hamburguesas" },
            { nombre: "Quesadilla de Pollo", descripcion: "Tortilla con pollo, queso y pimientos", precio: 420, cat: "Tex-Mex" },
            { nombre: "Fajitas de Res", descripcion: "Fajitas sizzling con pimientos y cebolla", precio: 650, cat: "Tex-Mex" },
            { nombre: "Southwestern Eggrolls", descripcion: "Rollitos rellenos de pollo y vegetales", precio: 380, cat: "Entradas" },
            { nombre: "Molten Chocolate Cake", descripcion: "Pastel de chocolate fundido con helado", precio: 350, cat: "Postres" },
        ]
    },
    "Panda Express": {
        categorias: ["Platos Principales", "Complementos", "Aperitivos", "Bebidas"],
        productos: [
            { nombre: "Orange Chicken", descripcion: "Pollo crujiente en salsa de naranja agridulce", precio: 380, cat: "Platos Principales" },
            { nombre: "Beijing Beef", descripcion: "Res crujiente en salsa agridulce con pimientos", precio: 420, cat: "Platos Principales" },
            { nombre: "Broccoli Beef", descripcion: "Res salteada con brócoli en salsa de jengibre", precio: 390, cat: "Platos Principales" },
            { nombre: "Kung Pao Chicken", descripcion: "Pollo con maní y vegetales en salsa picante", precio: 380, cat: "Platos Principales" },
            { nombre: "Chow Mein", descripcion: "Fideos salteados con vegetales", precio: 250, cat: "Complementos" },
            { nombre: "Fried Rice", descripcion: "Arroz frito con vegetales y huevo", precio: 230, cat: "Complementos" },
            { nombre: "Cream Cheese Rangoon", descripcion: "Wontones rellenos de queso crema", precio: 220, cat: "Aperitivos" },
            { nombre: "Té Verde", descripcion: "Té verde refrescante", precio: 100, cat: "Bebidas" },
        ]
    }
};

const SUCURSALES = {
    "Starbucks Coffee": [
        { nombre: "Starbucks Naco", direccion: "Av. Tiradentes #12, Naco", ciudad: "Santo Domingo", lat: 18.4715, lon: -69.9310, telefono: "809-565-0001" },
        { nombre: "Starbucks Ágora Mall", direccion: "Ágora Mall, Av. Abraham Lincoln", ciudad: "Santo Domingo", lat: 18.4735, lon: -69.9380, telefono: "809-565-0002" },
    ],
    "McDonald's": [
        { nombre: "McDonald's Churchill", direccion: "Av. Winston Churchill esq. 27 de Febrero", ciudad: "Santo Domingo", lat: 18.4650, lon: -69.9420, telefono: "809-566-0001" },
        { nombre: "McDonald's Megacentro", direccion: "Megacentro, Santiago", ciudad: "Santiago", lat: 19.4517, lon: -70.6970, telefono: "809-566-0002" },
    ],
    "KFC": [
        { nombre: "KFC 27 de Febrero", direccion: "Av. 27 de Febrero #200", ciudad: "Santo Domingo", lat: 18.4700, lon: -69.9350, telefono: "809-567-0001" },
    ],
    "Burger King": [
        { nombre: "Burger King Lincoln", direccion: "Av. Abraham Lincoln #550", ciudad: "Santo Domingo", lat: 18.4740, lon: -69.9370, telefono: "809-568-0001" },
    ],
    "Little Caesars": [
        { nombre: "Little Caesars Luperón", direccion: "Av. Luperón #88", ciudad: "Santo Domingo", lat: 18.4780, lon: -69.9550, telefono: "809-569-0001" },
    ],
    "Domino's Pizza": [
        { nombre: "Domino's Piantini", direccion: "Calle G. Mejía Ricart #120", ciudad: "Santo Domingo", lat: 18.4710, lon: -69.9330, telefono: "809-570-0001" },
    ],
    "Pizza Hut": [
        { nombre: "Pizza Hut Malecón", direccion: "Av. George Washington #450", ciudad: "Santo Domingo", lat: 18.4600, lon: -69.9260, telefono: "809-571-0001" },
    ],
    "Krispy Kreme": [
        { nombre: "Krispy Kreme Blue Mall", direccion: "Blue Mall, Av. Winston Churchill", ciudad: "Santo Domingo", lat: 18.4680, lon: -69.9440, telefono: "809-572-0001" },
    ],
    "Rico Hot Dog": [
        { nombre: "Rico Hot Dog Duarte", direccion: "Av. Duarte #310", ciudad: "Santo Domingo", lat: 18.4850, lon: -69.9250, telefono: "809-573-0001" },
    ],
    "Pizzarelli": [
        { nombre: "Pizzarelli Roberto Pastoriza", direccion: "Av. Roberto Pastoriza #201", ciudad: "Santo Domingo", lat: 18.4730, lon: -69.9345, telefono: "809-574-0001" },
    ],
    "Barra Payán": [
        { nombre: "Barra Payán Villa Mella", direccion: "Av. Hermanas Mirabal, Villa Mella", ciudad: "Santo Domingo Norte", lat: 18.5370, lon: -69.9120, telefono: "809-575-0001" },
    ],
    "Taco Bell": [
        { nombre: "Taco Bell Bella Vista", direccion: "Calle José Amado Soler #15", ciudad: "Santo Domingo", lat: 18.4695, lon: -69.9290, telefono: "809-576-0001" },
    ],
    "Helados Bon": [
        { nombre: "Helados Bon El Conde", direccion: "Calle El Conde #75, Zona Colonial", ciudad: "Santo Domingo", lat: 18.4730, lon: -69.8850, telefono: "809-577-0001" },
    ],
    "Chili's Grill & Bar": [
        { nombre: "Chili's Acropolis Center", direccion: "Acropolis Center, Av. Winston Churchill", ciudad: "Santo Domingo", lat: 18.4690, lon: -69.9400, telefono: "809-578-0001" },
    ],
    "Panda Express": [
        { nombre: "Panda Express Downtown", direccion: "Downtown Center, Av. Winston Churchill", ciudad: "Santo Domingo", lat: 18.4670, lon: -69.9430, telefono: "809-579-0001" },
    ],
};

const ROLES_POR_TENANT = [
    { nombre: "Administrador", permisos: { all: true } },
    { nombre: "Gerente", permisos: { orders: true, products: true, reports: true } },
    { nombre: "Cajero", permisos: { orders: true, payments: true } },
    { nombre: "Repartidor", permisos: { delivery: true, tracking: true } },
];

async function seedV2() {
    try {
        await db.sequelize.authenticate();
        console.log('✅ Conectado a la BD\n');

        const Tenant = db.tenants;
        const Categoria = db.categorias;
        const Producto = db.productos;
        const Sucursal = db.sucursales;
        const Rol = db.roles;

        // Limpiar datos anteriores (en orden de dependencia)
        console.log('🗑️  Limpiando datos previos...');
        if (Producto) await Producto.destroy({ where: {}, force: true });
        if (Categoria) await Categoria.destroy({ where: {}, force: true });
        if (Sucursal) await Sucursal.destroy({ where: {}, force: true });
        if (Rol) await Rol.destroy({ where: {}, force: true });
        console.log('   ✅ Datos limpiados\n');

        const tenants = await Tenant.findAll({ order: [['id', 'ASC']] });
        console.log(`📋 ${tenants.length} franquicias en BD\n`);

        let totalCats = 0, totalProds = 0, totalSucs = 0, totalRoles = 0;

        for (const tenant of tenants) {
            const data = FRANCHISE_DATA[tenant.nombre];
            const sucData = SUCURSALES[tenant.nombre];
            if (!data) { console.log(`⏭️  ${tenant.nombre} — sin datos, saltando`); continue; }

            console.log(`\n═══ ${tenant.nombre.toUpperCase()} (id: ${tenant.id}) ═══`);

            // Categorías
            const catMap = {};
            for (const catName of data.categorias) {
                const [cat] = await Categoria.findOrCreate({
                    where: { tenant_id: tenant.id, nombre: catName },
                    defaults: { tenant_id: tenant.id, nombre: catName, descripcion: `${catName} de ${tenant.nombre}` }
                });
                catMap[catName] = cat.id;
                console.log(`   📁 ${catName} (id: ${cat.id})`);
                totalCats++;
            }

            // Productos
            for (const prod of data.productos) {
                await Producto.create({
                    tenant_id: tenant.id,
                    categoria_id: catMap[prod.cat] || null,
                    nombre: prod.nombre,
                    descripcion: prod.descripcion,
                    precio: prod.precio,
                    activo: true
                });
                console.log(`   🍔 ${prod.nombre} — RD$${prod.precio}`);
                totalProds++;
            }

            // Sucursales
            if (sucData) {
                for (const suc of sucData) {
                    await Sucursal.create({ tenant_id: tenant.id, ...suc, activo: true });
                    console.log(`   🏪 ${suc.nombre}`);
                    totalSucs++;
                }
            }

            // Roles
            for (const rol of ROLES_POR_TENANT) {
                await Rol.findOrCreate({
                    where: { tenant_id: tenant.id, nombre: rol.nombre },
                    defaults: { tenant_id: tenant.id, nombre: rol.nombre, permisos: rol.permisos }
                });
                totalRoles++;
            }
            console.log(`   👤 4 roles creados`);
        }

        console.log('\n\n🎉 ══════════════════════════════════');
        console.log('   SEED V2 COMPLETADO');
        console.log('══════════════════════════════════════');
        console.log(`   📁 Categorías: ${totalCats}`);
        console.log(`   🍔 Productos:  ${totalProds}`);
        console.log(`   🏪 Sucursales: ${totalSucs}`);
        console.log(`   👤 Roles:      ${totalRoles}`);

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error fatal:', error);
        process.exit(1);
    }
}

seedV2();
