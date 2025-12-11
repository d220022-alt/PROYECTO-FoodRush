// seed-data.js
require('dotenv').config();
const db = require('./models');

async function seedData() {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Conectado a la base de datos');
    
    // Usar tenant_id = 1 (que ya existe según tus datos)
    const tenantId = 1;
    
    // 1. Crear algunos productos
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
      },
      {
        tenant_id: tenantId,
        nombre: 'Ensalada César',
        descripcion: 'Ensalada con pollo, croutones y aderezo césar',
        precio: 7.99,
        activo: true
      }
    ]);
    
    // 2. Crear un usuario de prueba
    console.log('👤 Creando usuario...');
    await db.usuarios.create({
      tenant_id: tenantId,
      nombre: 'Admin Demo',
      correo: 'admin@demo.com',
      contrasena: 'demo123', // En producción, esto debería estar encriptado
      rol_id: null,
      telefono: '+1234567890',
      activo: true
    });
    
    // 3. Crear un cliente de prueba
    console.log('👥 Creando cliente...');
    await db.clientes.create({
      tenant_id: tenantId,
      nombre: 'Cliente Demo',
      correo: 'cliente@demo.com',
      telefono: '+0987654321',
      direccion: 'Calle Demo 123',
      activo: true
    });
    
    // 4. Crear un pedido de prueba
    console.log('📦 Creando pedido...');
    await db.pedidos.create({
      tenant_id: tenantId,
      cliente_id: 1, // El cliente que acabamos de crear
      estado: 'pendiente',
      total: 25.98,
      direccion_entrega: 'Calle Demo 123',
      notas: 'Pedido de prueba',
      creado_en: new Date()
    });
    
    console.log('✅ Datos de prueba creados exitosamente');
    console.log('\n📊 Para probar:');
    console.log('   GET http://localhost:3000/api/productos?tenant_id=1');
    console.log('   GET http://localhost:3000/api/usuarios?tenant_id=1');
    console.log('   GET http://localhost:3000/api/pedidos?tenant_id=1');
    console.log('   GET http://localhost:3000/api/tenants');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error creando datos de prueba:', error);
    console.error('Detalles:', error.message);
    process.exit(1);
  }
}

seedData();