'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// Cargar configuración
const config = require(path.join(__dirname, '..', 'config', 'config.js'))[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// 1. CARGAR TODOS LOS MODELOS
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

// 2. ASOCIACIONES ESENCIALES (sin duplicados)
console.log('🔗 Configurando asociaciones esenciales...');

try {
  // Tenant es el centro de todo
  if (db.tenants) {
    console.log('   👑 Configurando relaciones con Tenant...');
    
    // Tenant tiene muchos...
    const tenantModels = ['usuarios', 'sucursales', 'clientes', 'productos', 'categorias', 'pedidos'];
    
    tenantModels.forEach(modelName => {
      if (db[modelName] && db[modelName].rawAttributes.tenant_id) {
        db.tenants.hasMany(db[modelName], { foreignKey: 'tenant_id' });
        db[modelName].belongsTo(db.tenants, { foreignKey: 'tenant_id' });
      }
    });
  }
  
  // Productos -> Variantes
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

// Pedido -> EstadoPedido
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

// Pedido -> Cliente (por si acaso también falta)
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
  
  // PedidoItems -> Producto
  if (db.pedidoitems && db.productos) {
    db.pedidoitems.belongsTo(db.productos, { 
      foreignKey: 'producto_id',
      as: 'producto'
    });
    console.log('   🔗 Items → Producto');
  }
  
  // Producto -> Categoría
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
  
  // Pedido -> Cliente
  if (db.pedidos && db.clientes) {
    db.pedidos.belongsTo(db.clientes, { 
      foreignKey: 'cliente_id',
      as: 'cliente'
    });
    db.clientes.hasMany(db.pedidos, { 
      foreignKey: 'cliente_id',
      as: 'pedidos'
    });
    console.log('   📝 Pedido → Cliente');
  }
  
  // Pedido -> Usuario (quien tomó el pedido)
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
  
  console.log('✅ Asociaciones configuradas correctamente');
  
} catch (error) {
  console.error('❌ Error configurando asociaciones:', error.message);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;