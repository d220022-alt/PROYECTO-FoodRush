// check-estados-pedidos.js - Archivito pa' checar si los estados existen o qué onda
require('dotenv').config();
const db = require('./models');

async function checkEstados() {
  try {
    const estados = await db.estadospedidos.findAll({
      attributes: ['id', 'codigo', 'descripcion']
    });

    console.log('📋 ESTOS SON LOS ESTADOS QUE TENEMOS:');
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