'use strict';

require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);
const db = {};

// Inicializar Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false, // cambiar a console.log si quieres ver queries
  }
);

// Importar todos los modelos generados
fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Crear relaciones si los modelos tienen associate()
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Exportar sequelize y los modelos
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

// Pedido tiene muchos items
models.pedidos.hasMany(models.pedido_items, {
  foreignKey: 'pedido_id'
});
models.pedido_items.belongsTo(models.pedidos, {
  foreignKey: 'pedido_id'
});

// Items pertenecen a una variante
models.pedido_items.belongsTo(models.producto_variantes, {
  foreignKey: 'variante_id'
});

// Variante tiene muchos items
models.producto_variantes.hasMany(models.pedido_items, {
  foreignKey: 'variante_id'
});
