/**
 * SEED COMPLETO - FoodRush
 * Crea categorías, sucursales, productos y roles para las 15 franquicias.
 * Ejecutar: $env:DATABASE_URL='...'; $env:NODE_ENV='production'; node seed-full-data.js
 */
require('dotenv').config();
const db = require('./models');

// ═══════════════════════════════════════════════════════════
// DATOS DE FRANQUICIAS
// ═══════════════════════════════════════════════════════════
const FRANCHISE_DATA = {
    "Starbucks Coffee": {
        categorias: ["Bebidas Calientes", "Bebidas Frías", "Frappuccinos", "Pasteles y Snacks"],
        sucursales: [
            { nombre: "Starbucks Naco", direccion: "Av. Tiradentes #12, Naco", ciudad: "Santo Domingo", lat: 18.4715, lon: -69.9310, telefono: "809-565-0001" },
            { nombre: "Starbucks Ágora Mall", direccion: "Ágora Mall, Av. Abraham Lincoln", ciudad: "Santo Domingo", lat: 18.4735, lon: -69.9380, telefono: "809-565-0002" },
        ],
        productos: [
            { nombre: "Caramel Macchiato", descripcion: "Espresso con leche vaporizada y caramelo", precio: 280, cat: "Bebidas Calientes" },
            { nombre: "Café Americano", descripcion: "Espresso con agua caliente", precio: 180, cat: "Bebidas Calientes" },
            { nombre: "Cappuccino", descripcion: "Espresso con espuma de leche cremosa", precio: 250, cat: "Bebidas Calientes" },
            { nombre: "Latte Vainilla", descripcion: "Espresso con leche y sirope de vainilla", precio: 270, cat: "Bebidas Calientes" },
            { nombre: "Iced Coffee", descripcion: "Café helado con hielo y leche", precio: 220, cat: "Bebidas Frías" },
            { nombre: "Cold Brew", descripcion: "Café extraído en frío 20 horas", precio: 260, cat: "Bebidas Frías" },
            { nombre: "Mocha Frappuccino", descripcion: "Frappuccino de chocolate y café", precio: 320, cat: "Frappuccinos" },
            { nombre: "Java Chip Frappuccino", descripcion: "Frappuccino con chips de chocolate", precio: 340, cat: "Frappuccinos" },
            { nombre: "Strawberry Frappuccino", descripcion: "Frappuccino de fresa y crema", precio: 310, cat: "Frappuccinos" },
            { nombre: "Croissant de Jamón y Queso", descripcion: "Croissant horneado relleno", precio: 195, cat: "Pasteles y Snacks" },
            { nombre: "Muffin de Chocolate", descripcion: "Muffin esponjoso con chips de chocolate", precio: 175, cat: "Pasteles y Snacks" },
            { nombre: "Cheesecake", descripcion: "Rebanada de cheesecake New York", precio: 250, cat: "Pasteles y Snacks" },
        ]
    },
    "McDonald's": {
        categorias: ["Hamburguesas", "Combos", "Pollo", "Desayunos", "Postres", "Bebidas"],
        sucursales: [
            { nombre: "McDonald's Churchill", direccion: "Av. Winston Churchill esq. 27 de Febrero", ciudad: "Santo Domingo", lat: 18.4650, lon: -69.9420, telefono: "809-566-0001" },
            { nombre: "McDonald's Megacentro", direccion: "Av. San Vicente de Paúl, Megacentro", ciudad: "Santiago", lat: 19.4517, lon: -70.6970, telefono: "809-566-0002" },
        ],
        productos: [
            { nombre: "Big Mac", descripcion: "Dos hamburguesas con salsa especial, lechuga y queso", precio: 350, cat: "Hamburguesas" },
            { nombre: "Cuarto de Libra con Queso", descripcion: "Hamburguesa 1/4 lb con queso americano", precio: 320, cat: "Hamburguesas" },
            { nombre: "McPollo", descripcion: "Pechuga empanizada con mayo y lechuga", precio: 280, cat: "Pollo" },
            { nombre: "McLobster", descripcion: "Hamburguesa de pollo crispy premium", precio: 390, cat: "Pollo" },
            { nombre: "McNuggets 10pc", descripcion: "10 piezas de nuggets crujientes", precio: 310, cat: "Pollo" },
            { nombre: "Combo Big Mac", descripcion: "Big Mac + papas medianas + bebida", precio: 520, cat: "Combos" },
            { nombre: "Combo McPollo", descripcion: "McPollo + papas medianas + bebida", precio: 450, cat: "Combos" },
            { nombre: "McFlurry Oreo", descripcion: "Helado con trozos de Oreo", precio: 220, cat: "Postres" },
            { nombre: "Hotcakes", descripcion: "3 hotcakes con mantequilla y sirope", precio: 250, cat: "Desayunos" },
            { nombre: "Coca-Cola Grande", descripcion: "Coca-Cola 32oz", precio: 120, cat: "Bebidas" },
        ]
    },
    "KFC": {
        categorias: ["Pollo Original", "Combos KFC", "Complementos", "Bebidas"],
        sucursales: [
            { nombre: "KFC 27 de Febrero", direccion: "Av. 27 de Febrero #200", ciudad: "Santo Domingo", lat: 18.4700, lon: -69.9350, telefono: "809-567-0001" },
            { nombre: "KFC Estrella Sadhalá", direccion: "Av. Estrella Sadhalá", ciudad: "Santiago", lat: 19.4580, lon: -70.6890, telefono: "809-567-0002" },
        ],
        productos: [
            { nombre: "Bucket 8 Piezas", descripcion: "8 piezas de pollo original crujiente", precio: 750, cat: "Pollo Original" },
            { nombre: "Bucket 12 Piezas", descripcion: "12 piezas de pollo original crujiente", precio: 1050, cat: "Pollo Original" },
            { nombre: "Combo Crunch", descripcion: "2 piezas + papas + bebida + galleta", precio: 420, cat: "Combos KFC" },
            { nombre: "Combo Familiar", descripcion: "8 piezas + 2 papas + ensalada + bebidas", precio: 1250, cat: "Combos KFC" },
            { nombre: "Popcorn Chicken", descripcion: "Trozos de pollo crujiente en balde", precio: 280, cat: "Pollo Original" },
            { nombre: "Papas Fritas Grandes", descripcion: "Papas fritas kentucky grandes", precio: 180, cat: "Complementos" },
            { nombre: "Ensalada Coleslaw", descripcion: "Ensalada de repollo cremosa", precio: 130, cat: "Complementos" },
            { nombre: "Limonada KFC", descripcion: "Limonada natural grande", precio: 120, cat: "Bebidas" },
        ]
    },
    "Burger King": {
        categorias: ["Whoppers", "Combos BK", "Pollo", "Postres"],
        sucursales: [
            { nombre: "Burger King Lincoln", direccion: "Av. Abraham Lincoln #550", ciudad: "Santo Domingo", lat: 18.4740, lon: -69.9370, telefono: "809-568-0001" },
        ],
        productos: [
            { nombre: "Whopper", descripcion: "Hamburguesa a la parrilla con vegetales frescos", precio: 350, cat: "Whoppers" },
            { nombre: "Whopper con Queso", descripcion: "Whopper clásico con queso americano", precio: 380, cat: "Whoppers" },
            { nombre: "Double Whopper", descripcion: "Doble carne a la parrilla", precio: 480, cat: "Whoppers" },
            { nombre: "Combo Whopper", descripcion: "Whopper + papas + bebida", precio: 520, cat: "Combos BK" },
            { nombre: "Chicken Fries", descripcion: "Tiras de pollo empanizado crujiente", precio: 250, cat: "Pollo" },
            { nombre: "Sundae de Chocolate", descripcion: "Helado suave con sirope de chocolate", precio: 150, cat: "Postres" },
        ]
    },
    "Little Caesars": {
        categorias: ["Pizzas", "Complementos", "Bebidas"],
        sucursales: [
            { nombre: "Little Caesars Luperón", direccion: "Av. Luperón #88", ciudad: "Santo Domingo", lat: 18.4780, lon: -69.9550, telefono: "809-569-0001" },
        ],
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
        categorias: ["Pizzas Clásicas", "Pizzas Especiales", "Complementos", "Bebidas"],
        sucursales: [
            { nombre: "Domino's Piantini", direccion: "Calle Gustavo A. Mejía Ricart #120", ciudad: "Santo Domingo", lat: 18.4710, lon: -69.9330, telefono: "809-570-0001" },
            { nombre: "Domino's Santiago Centro", direccion: "Calle del Sol #45", ciudad: "Santiago", lat: 19.4510, lon: -70.6940, telefono: "809-570-0002" },
        ],
        productos: [
            { nombre: "Pepperoni Clásica", descripcion: "Pizza con abundante pepperoni", precio: 450, cat: "Pizzas Clásicas" },
            { nombre: "Hawaiana", descripcion: "Jamón, piña y queso mozzarella", precio: 480, cat: "Pizzas Clásicas" },
            { nombre: "MeatZZa", descripcion: "Pepperoni, salchicha, carne y jamón", precio: 550, cat: "Pizzas Especiales" },
            { nombre: "ExtravaganZZa", descripcion: "Con todo: pepperoni, jamón, carne, olivas, pimiento", precio: 599, cat: "Pizzas Especiales" },
            { nombre: "Cheesy Bread", descripcion: "Pan con queso fundido", precio: 250, cat: "Complementos" },
            { nombre: "Lava Cake", descripcion: "Pastel de chocolate fundido", precio: 220, cat: "Complementos" },
            { nombre: "Coca-Cola 2L", descripcion: "Coca-Cola de 2 litros", precio: 130, cat: "Bebidas" },
        ]
    },
    "Pizza Hut": {
        categorias: ["Pizzas Pan", "Pizzas Delgadas", "Pastas", "Complementos"],
        sucursales: [
            { nombre: "Pizza Hut Malecón", direccion: "Av. George Washington #450", ciudad: "Santo Domingo", lat: 18.4600, lon: -69.9260, telefono: "809-571-0001" },
        ],
        productos: [
            { nombre: "Supreme Pan Pizza", descripcion: "Pizza pan con pepperoni, champiñones, pimiento y cebolla", precio: 520, cat: "Pizzas Pan" },
            { nombre: "Meat Lovers Pan", descripcion: "Pizza pan con carnes surtidas", precio: 560, cat: "Pizzas Pan" },
            { nombre: "Margarita Delgada", descripcion: "Pizza masa delgada con tomate fresco y albahaca", precio: 430, cat: "Pizzas Delgadas" },
            { nombre: "Pasta Alfredo", descripcion: "Pasta con salsa alfredo y pollo", precio: 380, cat: "Pastas" },
            { nombre: "Breadsticks", descripcion: "Palitos de pan con salsa marinara", precio: 200, cat: "Complementos" },
        ]
    },
    "Krispy Kreme": {
        categorias: ["Donas Clásicas", "Donas Especiales", "Bebidas", "Docenas"],
        sucursales: [
            { nombre: "Krispy Kreme Blue Mall", direccion: "Blue Mall, Av. Winston Churchill", ciudad: "Santo Domingo", lat: 18.4680, lon: -69.9440, telefono: "809-572-0001" },
        ],
        productos: [
            { nombre: "Original Glazed", descripcion: "Dona glaseada original", precio: 85, cat: "Donas Clásicas" },
            { nombre: "Chocolate Iced Glazed", descripcion: "Dona glaseada con chocolate", precio: 95, cat: "Donas Clásicas" },
            { nombre: "Strawberry Iced", descripcion: "Dona con glaseado de fresa y chispas", precio: 110, cat: "Donas Especiales" },
            { nombre: "Oreo Cookies & Kreme", descripcion: "Dona rellena de crema con Oreo", precio: 130, cat: "Donas Especiales" },
            { nombre: "Docena Original Glazed", descripcion: "12 donas glaseadas originales", precio: 750, cat: "Docenas" },
            { nombre: "Docena Surtida", descripcion: "12 donas variadas", precio: 950, cat: "Docenas" },
            { nombre: "Café Latte", descripcion: "Café latte cremoso", precio: 180, cat: "Bebidas" },
        ]
    },
    "Rico Hot Dog": {
        categorias: ["Hot Dogs", "Hamburguesas", "Complementos", "Bebidas"],
        sucursales: [
            { nombre: "Rico Hot Dog Duarte", direccion: "Av. Duarte #310", ciudad: "Santo Domingo", lat: 18.4850, lon: -69.9250, telefono: "809-573-0001" },
        ],
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
        sucursales: [
            { nombre: "Pizzarelli Roberto Pastoriza", direccion: "Av. Roberto Pastoriza #201", ciudad: "Santo Domingo", lat: 18.4730, lon: -69.9345, telefono: "809-574-0001" },
        ],
        productos: [
            { nombre: "Pizza Margherita", descripcion: "Tomate San Marzano, mozzarella y albahaca", precio: 450, cat: "Pizzas" },
            { nombre: "Pizza Quattro Formaggi", descripcion: "Cuatro quesos: mozzarella, gorgonzola, parmesano y fontina", precio: 520, cat: "Pizzas" },
            { nombre: "Calzone Napolitano", descripcion: "Relleno de ricotta, jamón y champiñones", precio: 420, cat: "Calzones" },
            { nombre: "Penne Arrabbiata", descripcion: "Pasta con salsa picante de tomate", precio: 380, cat: "Pastas" },
            { nombre: "Ensalada Caesar", descripcion: "Lechuga romana, crutones, parmesano", precio: 280, cat: "Ensaladas" },
        ]
    },
    "Barra Payán": {
        categorias: ["Hamburguesas", "Picaderas", "Bebidas", "Especiales"],
        sucursales: [
            { nombre: "Barra Payán Villa Mella", direccion: "Av. Hermanas Mirabal, Villa Mella", ciudad: "Santo Domingo Norte", lat: 18.5370, lon: -69.9120, telefono: "809-575-0001" },
        ],
        productos: [
            { nombre: "Chimi Clásico", descripcion: "El auténtico chimi dominicano con repollo", precio: 200, cat: "Hamburguesas" },
            { nombre: "Chimi Doble", descripcion: "Doble carne con queso y repollo", precio: 300, cat: "Hamburguesas" },
            { nombre: "Yaroa de Pollo", descripcion: "Papas, pollo, queso fundido y ketchup", precio: 350, cat: "Especiales" },
            { nombre: "Yaroa Mixta", descripcion: "Papas, carne, pollo, queso y salsas", precio: 400, cat: "Especiales" },
            { nombre: "Plátano Frito", descripcion: "Tostones crujientes", precio: 100, cat: "Picaderas" },
            { nombre: "Morir Soñando", descripcion: "Jugo de naranja con leche, una delicia", precio: 130, cat: "Bebidas" },
        ]
    },
    "Taco Bell": {
        categorias: ["Tacos", "Burritos", "Combos", "Bebidas"],
        sucursales: [
            { nombre: "Taco Bell Bella Vista", direccion: "Calle José Amado Soler #15, Bella Vista", ciudad: "Santo Domingo", lat: 18.4695, lon: -69.9290, telefono: "809-576-0001" },
        ],
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
        categorias: ["Helados", "Batidos", "Postres Especiales", "Sundaes"],
        sucursales: [
            { nombre: "Helados Bon El Conde", direccion: "Calle El Conde #75, Zona Colonial", ciudad: "Santo Domingo", lat: 18.4730, lon: -69.8850, telefono: "809-577-0001" },
            { nombre: "Helados Bon Santiago", direccion: "Av. Juan Pablo Duarte #112", ciudad: "Santiago", lat: 19.4540, lon: -70.6980, telefono: "809-577-0002" },
        ],
        productos: [
            { nombre: "Helado de Vainilla 2 bolas", descripcion: "Helado artesanal de vainilla", precio: 150, cat: "Helados" },
            { nombre: "Helado de Chocolate 2 bolas", descripcion: "Helado artesanal de chocolate belga", precio: 150, cat: "Helados" },
            { nombre: "Helado de Cookies & Cream", descripcion: "Helado con trozos de galleta Oreo", precio: 170, cat: "Helados" },
            { nombre: "Batido de Fresa", descripcion: "Batido cremoso de fresa natural", precio: 220, cat: "Batidos" },
            { nombre: "Banana Split", descripcion: "Banana con 3 bolas de helado, sirope y crema", precio: 320, cat: "Sundaes" },
            { nombre: "Brownie con Helado", descripcion: "Brownie caliente con helado de vainilla", precio: 280, cat: "Postres Especiales" },
        ]
    },
    "Chili's Grill & Bar": {
        categorias: ["Entradas", "Hamburguesas", "Costillas", "Tex-Mex", "Postres"],
        sucursales: [
            { nombre: "Chili's Acropolis Center", direccion: "Acropolis Center, Av. Winston Churchill", ciudad: "Santo Domingo", lat: 18.4690, lon: -69.9400, telefono: "809-578-0001" },
        ],
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
        sucursales: [
            { nombre: "Panda Express Downtown Center", direccion: "Downtown Center, Av. Winston Churchill", ciudad: "Santo Domingo", lat: 18.4670, lon: -69.9430, telefono: "809-579-0001" },
        ],
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

// ═══════════════════════════════════════════════════════════
// DATOS DE ESTADOS DE PEDIDOS y ROLES
// ═══════════════════════════════════════════════════════════
const ESTADOS_PEDIDOS = [
    { codigo: "pendiente", descripcion: "Pedido recibido" },
    { codigo: "confirmado", descripcion: "Pedido confirmado por el restaurante" },
    { codigo: "preparando", descripcion: "Pedido en preparación" },
    { codigo: "en_transito", descripcion: "Pedido en camino" },
    { codigo: "entregado", descripcion: "Pedido entregado" },
    { codigo: "cancelado", descripcion: "Pedido cancelado" },
];

const METODOS_PAGO = [
    { codigo: "efectivo", nombre: "Efectivo" },
    { codigo: "tarjeta", nombre: "Tarjeta crédito/débito" },
    { codigo: "mercadopago", nombre: "MercadoPago" },
    { codigo: "stripe", nombre: "Stripe" },
    { codigo: "paypal", nombre: "PayPal" },
    { codigo: "transferencia", nombre: "Transferencia bancaria" },
];

const ROLES_POR_TENANT = [
    { nombre: "Administrador", permisos: { all: true } },
    { nombre: "Gerente", permisos: { orders: true, products: true, reports: true } },
    { nombre: "Cajero", permisos: { orders: true, payments: true } },
    { nombre: "Repartidor", permisos: { delivery: true, tracking: true } },
];

// ═══════════════════════════════════════════════════════════
// FUNCIÓN PRINCIPAL
// ═══════════════════════════════════════════════════════════
async function seedFullData() {
    try {
        await db.sequelize.authenticate();
        console.log('✅ Conectado a la BD\n');

        // 1. Obtener tenants existentes
        const Tenant = db.tenants;
        const tenants = await Tenant.findAll({ order: [['id', 'ASC']] });
        console.log(`📋 ${tenants.length} franquicias encontradas en BD`);

        // 2. Seed Estados de Pedidos
        console.log('\n═══ ESTADOS DE PEDIDOS ═══');
        const EstadoPedido = db.estadospedidos;
        if (EstadoPedido) {
            for (const ep of ESTADOS_PEDIDOS) {
                try {
                    await EstadoPedido.findOrCreate({ where: { codigo: ep.codigo }, defaults: ep });
                    console.log(`   ✅ ${ep.codigo}`);
                } catch (e) { console.log(`   ⚠️ ${ep.codigo}: ${e.message}`); }
            }
        }

        // 3. Seed Métodos de Pago
        console.log('\n═══ MÉTODOS DE PAGO ═══');
        const MetodoPago = db.metodospago;
        if (MetodoPago) {
            for (const mp of METODOS_PAGO) {
                try {
                    await MetodoPago.findOrCreate({ where: { codigo: mp.codigo }, defaults: { ...mp, activo: true } });
                    console.log(`   ✅ ${mp.nombre}`);
                } catch (e) { console.log(`   ⚠️ ${mp.nombre}: ${e.message}`); }
            }
        }

        // 4. Para cada franquicia: categorías, sucursales, productos, roles
        const Categoria = db.categorias;
        const Producto = db.productos;
        const Sucursal = db.sucursales;
        const Rol = db.roles;

        for (const tenant of tenants) {
            const data = FRANCHISE_DATA[tenant.nombre];
            if (!data) {
                console.log(`\n⏭️  ${tenant.nombre} — no hay datos definidos, saltando`);
                continue;
            }

            console.log(`\n═══ ${tenant.nombre.toUpperCase()} (tenant_id: ${tenant.id}) ═══`);

            // 4a. Categorías
            const catMap = {};
            if (Categoria && data.categorias) {
                for (const catName of data.categorias) {
                    try {
                        const [cat] = await Categoria.findOrCreate({
                            where: { tenant_id: tenant.id, nombre: catName },
                            defaults: { tenant_id: tenant.id, nombre: catName, descripcion: `Categoría ${catName} de ${tenant.nombre}` }
                        });
                        catMap[catName] = cat.id;
                        console.log(`   📁 Categoría: ${catName} (id: ${cat.id})`);
                    } catch (e) { console.log(`   ⚠️ Cat ${catName}: ${e.message}`); }
                }
            }

            // 4b. Sucursales
            if (Sucursal && data.sucursales) {
                for (const suc of data.sucursales) {
                    try {
                        await Sucursal.findOrCreate({
                            where: { tenant_id: tenant.id, nombre: suc.nombre },
                            defaults: { tenant_id: tenant.id, ...suc, activo: true }
                        });
                        console.log(`   🏪 Sucursal: ${suc.nombre}`);
                    } catch (e) { console.log(`   ⚠️ Suc ${suc.nombre}: ${e.message}`); }
                }
            }

            // 4c. Productos
            if (Producto && data.productos) {
                for (const prod of data.productos) {
                    try {
                        const categoria_id = catMap[prod.cat] || null;
                        await Producto.findOrCreate({
                            where: { tenant_id: tenant.id, nombre: prod.nombre },
                            defaults: {
                                tenant_id: tenant.id,
                                categoria_id,
                                nombre: prod.nombre,
                                descripcion: prod.descripcion,
                                precio: prod.precio,
                                activo: true
                            }
                        });
                        console.log(`   🍔 ${prod.nombre} — RD$${prod.precio}`);
                    } catch (e) { console.log(`   ⚠️ Prod ${prod.nombre}: ${e.message}`); }
                }
            }

            // 4d. Roles
            if (Rol) {
                for (const rol of ROLES_POR_TENANT) {
                    try {
                        await Rol.findOrCreate({
                            where: { tenant_id: tenant.id, nombre: rol.nombre },
                            defaults: { tenant_id: tenant.id, nombre: rol.nombre, permisos: rol.permisos }
                        });
                        console.log(`   👤 Rol: ${rol.nombre}`);
                    } catch (e) { console.log(`   ⚠️ Rol ${rol.nombre}: ${e.message}`); }
                }
            }
        }

        // 5. Resumen final
        console.log('\n\n🎉 ══════════════════════════════════════');
        console.log('   SEED COMPLETO EXITOSO');
        console.log('══════════════════════════════════════════');

        const counts = {};
        const modelsToCount = { categorias: Categoria, productos: Producto, sucursales: Sucursal, roles: Rol, estadospedidos: EstadoPedido, metodospago: MetodoPago };
        for (const [name, model] of Object.entries(modelsToCount)) {
            if (model) counts[name] = await model.count();
        }
        console.log('\n📊 Totales en BD:');
        for (const [name, count] of Object.entries(counts)) {
            console.log(`   ${name}: ${count}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error fatal:', error);
        process.exit(1);
    }
}

seedFullData();
