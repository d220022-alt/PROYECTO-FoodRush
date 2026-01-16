'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// Cargar configuración (lo que dice el .env o config.js)
const config = require(path.join(__dirname, '..', 'config', 'config.js'))[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// 1. CARGAR TODOS LOS MODELOS (Magia negra de Sequelize para leer los archivos)
console.log('📦 Cargando modelos...');
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    try {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
      console.log(`   ✅ ${model.name}`);
    } catch (error) {
      console.error(`   ❌ Error en ${file}:`, error.message);
    }
  });

console.log('📦 Modelos cargados:', Object.keys(db).join(', '));
// 2. ASOCIACIONES ESENCIALES (A juntar todo con todo)
console.log('🔗 Armando el rompecabezas (Relaciones)...');

try {
  // El Tenant manda aquí, todo es suyo
  if (db.tenants) {
    console.log('   👑 Configurando relaciones con Tenant...');

    // El Tenant tiene un buen de cosas...
    const tenantModels = ['usuarios', 'sucursales', 'clientes', 'productos', 'categorias', 'pedidos'];

    tenantModels.forEach(modelName => {
      if (db[modelName] && db[modelName].rawAttributes.tenant_id) {
        db.tenants.hasMany(db[modelName], { foreignKey: 'tenant_id' });
        db[modelName].belongsTo(db.tenants, { foreignKey: 'tenant_id' });
      }
    });
  }

  // Productos y sus Variantes (S, M, L, etc)
  if (db.productos && db.productosvariantes) {
    db.productos.hasMany(db.productosvariantes, {
      foreignKey: 'producto_id',
      as: 'variantes'
    });
    db.productosvariantes.belongsTo(db.productos, {
      foreignKey: 'producto_id',
      as: 'producto'
    });
    console.log('   🍕 Productos → Variantes');
  }

  // Pedidos -> Items
  // En models/index.js, dentro del try {...}, DESPUÉS de las otras asociaciones:

  // Pedido -> EstadoPedido (¿Cómo va la orden?)
  if (db.pedidos && db.estadospedidos) {
    db.pedidos.belongsTo(db.estadospedidos, {
      foreignKey: 'estado_id',
      as: 'estado'
    });

    db.estadospedidos.hasMany(db.pedidos, {
      foreignKey: 'estado_id',
      as: 'pedidos'
    });

    console.log('   📋 Pedido → EstadoPedido');
  }

  // Pedido -> Cliente (¿Quién compró?)
  if (db.pedidos && db.clientes) {
    db.pedidos.belongsTo(db.clientes, {
      foreignKey: 'cliente_id',
      as: 'cliente'
    });

    db.clientes.hasMany(db.pedidos, {
      foreignKey: 'cliente_id',
      as: 'pedidos'
    });

    console.log('   👤 Pedido → Cliente');
  }

  // PedidoItems -> Producto (Manejado en el modelo, se elimina de aquí para evitar doublé alias)
  /*
  if (db.pedidoitems && db.productos) {
    db.pedidoitems.belongsTo(db.productos, {
      foreignKey: 'producto_id',
      as: 'producto'
    });
    console.log('   🔗 Items → Producto');
  }
  */

  // Producto -> Categoría (¿De qué tipo es?)
  /*
  if (db.productos && db.categorias) {
    db.productos.belongsTo(db.categorias, {
      foreignKey: 'categoria_id',
      as: 'categoria'
    });
    db.categorias.hasMany(db.productos, {
      foreignKey: 'categoria_id',
      as: 'productos'
    });
    console.log('   🏷️  Producto → Categoría');
  }
  */


  // Pedido -> Usuario (¿Quién lo atendió?)
  if (db.pedidos && db.usuarios) {
    db.pedidos.belongsTo(db.usuarios, {
      foreignKey: 'usuario_id',
      as: 'usuario'
    });
    db.usuarios.hasMany(db.pedidos, {
      foreignKey: 'usuario_id',
      as: 'pedidos'
    });
    console.log('   👤 Pedido → Usuario');
  }



  console.log('✅ Manual relationships configured');

  // 3. AUTO-LOAD ASSOCIATIONS (The Standard Way)
  // This ensures models identifying their own relations (like 'associate' method) get executed.
  // This creates a robust hybrid: manual overrides + self-definition.
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      console.log(`   🔄 Auto-associating ${modelName}...`);
      db[modelName].associate(db);
    }
  });

  console.log('✅ Todo conectado al 100');

  // FINAL FORCE: Ensure products have images association
  if (db.productos && db.productos_imagenes) {
    db.productos.hasMany(db.productos_imagenes, {
      foreignKey: 'producto_id',
      as: 'imagenes'
    });
    console.log('   📸 FINAL FORCE: Productos → Imagenes');
  }

} catch (error) {
  console.error('❌ Algo tronó en las relaciones:', error.message);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;