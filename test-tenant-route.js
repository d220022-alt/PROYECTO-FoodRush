// test-tenant-route.js
const express = require('express');
const app = express();

// Middleware básico
app.use(express.json());

// Ruta de prueba SIN controlador externo
app.post('/test', (req, res) => {
  res.json({ success: true, message: 'Test route works' });
});

// Probar a cargar el controlador
try {
  const tenantController = require('./controllers/TenantController');
  console.log('✅ TenantController cargado en prueba');
  console.log('   Tipo:', typeof tenantController);
  console.log('   create tipo:', typeof tenantController.create);
  
  // Usar el controlador
  app.post('/test2', tenantController.create);
  
} catch (error) {
  console.error('❌ Error en prueba:', error);
  app.post('/test2', (req, res) => res.json({ error: 'Controller failed' }));
}

app.listen(3001, () => {
  console.log('Test server en puerto 3001');
});