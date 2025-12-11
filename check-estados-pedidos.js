// check-estados-pedidos.js
require('dotenv').config();
const db = require('./models');

async function checkEstados() {
  try {
    const estados = await db.estadospedidos.findAll({
      attributes: ['id', 'codigo', 'descripcion']
    });

    console.log('📋 ESTADOS DE PEDIDOS DISPONIBLES:');
    estados.forEach(estado => {
      console.log(`   ${estado.id}. ${estado.codigo} - ${estado.descripcion || 'Sin descripción'}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkEstados();