/*
  Guia rapida para presentar:
  Sincroniza categorias del catalogo con la base de datos y corrige productos sin categoria.
  Buscar en VS Code: sync categorias, seed categorias, productos categoria_id, mantenimiento DB.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
const db = require('../models');

const CATALOG = [
  { tenantId: 1, name: 'Starbucks', categories: ['Bebidas', 'Comida', 'Café en Casa'] },
  { tenantId: 2, name: "McDonald's", categories: ['Hamburguesas', 'Complementos', 'Bebidas', 'Postres'] },
  { tenantId: 3, name: 'KFC', categories: ['Pollo', 'Combos', 'Acompañantes', 'Bebidas'] },
  { tenantId: 4, name: 'Burger King', categories: ['Hamburguesas', 'Combos', 'Acompañantes', 'Bebidas'] },
  { tenantId: 5, name: 'Little Caesars', categories: ['Pizzas', 'Combos', 'Acompañantes', 'Bebidas'] },
  { tenantId: 6, name: "Domino's Pizza", categories: ['Pizzas', 'Combos', 'Acompañantes', 'Bebidas'] },
  { tenantId: 7, name: 'Pizza Hut', categories: ['Pizzas', 'Pastas', 'Acompañantes', 'Bebidas'] },
  { tenantId: 8, name: 'Krispy Kreme', categories: ['Donas', 'Bebidas', 'Combos', 'Postres'] },
  { tenantId: 9, name: 'Rico Hot Dog', categories: ['Hot Dogs', 'Combos', 'Acompañantes', 'Bebidas'] },
  { tenantId: 10, name: 'Pizzarelli', categories: ['Pizzas', 'Pastas', 'Acompañantes', 'Bebidas'] },
  { tenantId: 11, name: 'Barra Payán', categories: ['Hamburguesas', 'Chimi', 'Acompañantes', 'Bebidas'] },
  { tenantId: 12, name: 'Taco Bell', categories: ['Tacos', 'Burritos', 'Nachos', 'Bebidas'] },
  { tenantId: 13, name: 'Helados Bon', categories: ['Helados', 'Postres', 'Combos', 'Bebidas'] },
  { tenantId: 14, name: "Chili's", categories: ['Platos', 'Combos', 'Acompañantes', 'Bebidas'] },
  { tenantId: 15, name: 'Panda Express', categories: ['Pollo', 'Res', 'Acompañantes', 'Bebidas'] }
];

const DISPLAY_NAMES = {
  'cafe en casa': 'Café en Casa',
  acompanantes: 'Acompañantes'
};

const RULES = [
  { category: 'Bebidas', tokens: ['bebida', 'refresco', 'coca', 'cola', 'sprite', 'jugo', 'limonada', 'agua', 'cafe', 'frappe', 'malteada', 'smoothie'] },
  { category: 'Postres', tokens: ['postre', 'flurry', 'sundae', 'helado', 'pastel', 'galleta', 'brownie', 'cake', 'oreo'] },
  { category: 'Helados', tokens: ['helado', 'sundae', 'cono', 'barquilla', 'bola', 'paleta'] },
  { category: 'Hamburguesas', tokens: ['hamburguesa', 'burger', 'big mac', 'cuarto', 'whopper', 'quesoburger', 'doble carne'] },
  { category: 'Complementos', tokens: ['nugget', 'papas', 'fritas', 'ensalada', 'complemento'] },
  { category: 'Acompañantes', tokens: ['acompanante', 'papas', 'fritas', 'pan', 'snack', 'ensalada', 'aros', 'nachos'] },
  { category: 'Pizzas', tokens: ['pizza', 'pepperoni', 'margarita', 'suprema', 'queso'] },
  { category: 'Pastas', tokens: ['pasta', 'lasagna', 'spaghetti', 'alfredo'] },
  { category: 'Pollo', tokens: ['pollo', 'chicken', 'crispy', 'tender', 'alita', 'bucket'] },
  { category: 'Combos', tokens: ['combo', 'duo', 'familiar', 'meal', 'caja'] },
  { category: 'Donas', tokens: ['dona', 'donut', 'glaseada'] },
  { category: 'Chimi', tokens: ['chimi', 'chimis'] },
  { category: 'Hot Dogs', tokens: ['hot dog', 'perro', 'salchicha'] },
  { category: 'Tacos', tokens: ['taco'] },
  { category: 'Burritos', tokens: ['burrito'] },
  { category: 'Nachos', tokens: ['nacho'] },
  { category: 'Res', tokens: ['res', 'beef', 'carne'] },
  { category: 'Platos', tokens: ['plato', 'costilla', 'fajita', 'rib', 'grill'] },
  { category: 'Comida', tokens: ['comida', 'sandwich', 'croissant', 'panini', 'wrap'] },
  { category: 'Café en Casa', tokens: ['grano', 'molido', 'capsula', 'cafe en casa'] }
];

const normalize = (value = '') =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

const displayName = (category) => DISPLAY_NAMES[normalize(category)] || category;

const getCatalogForTenant = (tenantId) =>
  CATALOG.find((item) => Number(item.tenantId) === Number(tenantId));

const inferCategoryName = (product, categoryNames) => {
  const source = normalize(`${product.nombre || ''} ${product.descripcion || ''}`);
  const description = normalize(product.descripcion || '');

  const categoryFromPrefix = /^([a-z0-9\s]+?)\s*[-:]/i.exec(description);
  if (categoryFromPrefix) {
    const prefixed = normalize(categoryFromPrefix[1]);
    const matched = categoryNames.find((name) => normalize(name) === prefixed);
    if (matched) return matched;
  }

  const categoryFromDescription = /categoria\s+([a-z0-9\s]+?)(?:\s+en|\.$|,|$)/i.exec(source);
  if (categoryFromDescription) {
    const described = normalize(categoryFromDescription[1]);
    const matched = categoryNames.find((name) => normalize(name) === described);
    if (matched) return matched;
  }

  for (const rule of RULES) {
    const available = categoryNames.find((name) => normalize(name) === normalize(rule.category));
    if (available && rule.tokens.some((token) => source.includes(normalize(token)))) {
      return available;
    }
  }

  return null;
};

async function syncCatalogCategories() {
  await db.sequelize.authenticate();

  let createdCount = 0;
  let updatedProducts = 0;

  const tenants = await db.tenants.findAll({
    attributes: ['id', 'nombre'],
    order: [['id', 'ASC']]
  });

  for (const tenant of tenants) {
    const catalog = getCatalogForTenant(tenant.id);
    if (!catalog) continue;

    const categoriesByName = new Map();

    for (const rawName of catalog.categories) {
      const name = displayName(rawName);
      const [category, created] = await db.categorias.findOrCreate({
        where: {
          tenant_id: tenant.id,
          nombre: name
        },
        defaults: {
          descripcion: `Categoria de catalogo para ${tenant.nombre}`
        }
      });

      categoriesByName.set(normalize(category.nombre), category);
      if (created) createdCount += 1;
    }

    const products = await db.productos.findAll({
      where: { tenant_id: tenant.id },
      attributes: ['id', 'tenant_id', 'nombre', 'descripcion', 'categoria_id']
    });

    const validCategoryIds = new Set([...categoriesByName.values()].map((category) => Number(category.id)));
    const categoryNames = [...categoriesByName.values()].map((category) => category.nombre);

    for (const product of products) {
      const currentCategoryId = Number(product.categoria_id);
      const inferredName = inferCategoryName(product, categoryNames);
      const currentCategory = [...categoriesByName.values()].find((category) => Number(category.id) === currentCategoryId);

      if (
        Number.isFinite(currentCategoryId) &&
        validCategoryIds.has(currentCategoryId) &&
        (!inferredName || normalize(currentCategory?.nombre) === normalize(inferredName))
      ) {
        continue;
      }

      const fallbackName = categoryNames[0];
      const targetCategory = categoriesByName.get(normalize(inferredName || fallbackName));
      if (!targetCategory) continue;

      await product.update({ categoria_id: targetCategory.id });
      updatedProducts += 1;
    }
  }

  console.log(`Categorias creadas: ${createdCount}`);
  console.log(`Productos corregidos: ${updatedProducts}`);
}

syncCatalogCategories()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error sincronizando categorias:', error.message);
    process.exit(1);
  });
