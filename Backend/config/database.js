const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('FoodRushMultiTenant', 'postgres', 'randycairo17', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;
