/*
  Guia rapida para presentar:
  Script de mantenimiento o carga de datos: Seed Data. Se usa para revisar, migrar o sembrar informacion durante pruebas y despliegues.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
// seed-data.js - VERSIÓN MEJORADA QUE EVITA DUPLICADOS
require('dotenv').config();
const db = require('./models');

async function seedData() {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Conectado a la base de datos');
    
    const tenantId = 1;
    
    console.log('📊 Verificando datos existentes...');
    
    // 1. Verificar si ya hay productos
    const productosCount = await db.productos.count({
      where: { tenant_id: tenantId }
    });
    
    if (productosCount === 0) {
      console.log('📦 Creando productos...');
      await db.productos.bulkCreate([
        {
          tenant_id: tenantId,
          nombre: 'Hamburguesa Clásica',
          descripcion: 'Hamburguesa con queso, lechuga y tomate',
          precio: 8.99,
          activo: true
        },
        {
          tenant_id: tenantId,
          nombre: 'Pizza Margarita',
          descripcion: 'Pizza con salsa de tomate, mozzarella y albahaca',
          precio: 12.50,
          activo: true
        }
      ]);
    } else {
      console.log(`✅ Ya existen ${productosCount} productos`);
    }
    
    // 2. Verificar si ya existe el usuario
    const usuarioExistente = await db.usuarios.findOne({
      where: {
        tenant_id: tenantId,
        correo: 'admin@demo.com'
      }
    });
    
    if (!usuarioExistente) {
      console.log('👤 Creando usuario...');
      await db.usuarios.create({
        tenant_id: tenantId,
        nombre: 'Admin Demo',
        correo: 'admin@demo.com',
        contrasena: 'demo123',
        rol_id: null,
        telefono: '+1234567890',
        activo: true
      });
    } else {
      console.log('✅ Usuario admin@demo.com ya existe');
    }
    
    // 3. Crear cliente con correo diferente si ya existe
    const clienteCorreo = 'cliente' + Date.now() + '@demo.com';
    console.log(`👥 Creando cliente con correo: ${clienteCorreo}`);
    
    await db.clientes.create({
      tenant_id: tenantId,
      nombre: 'Cliente Demo',
      correo: clienteCorreo,
      telefono: '+0987654321',
      direccion: 'Calle Demo 123',
      activo: true
    });
    
    console.log('\n✅ Datos verificados/creados exitosamente');
    console.log('\n📊 Para probar:');
    console.log('   GET http://localhost:3000/api/health');
    console.log('   GET http://localhost:3000/api/productos?tenant_id=1');
    console.log('   GET http://localhost:3000/api/usuarios?tenant_id=1');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedData();