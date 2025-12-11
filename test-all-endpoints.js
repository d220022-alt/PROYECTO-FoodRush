// test-all-endpoints.js
const http = require('http');

const BASE_URL = 'http://localhost:3000';
const TENANT_ID = 1;

const endpoints = [
  {
    name: 'Health Check',
    method: 'GET',
    path: '/api/health',
    needsTenant: false
  },
  {
    name: 'Test Models',
    method: 'GET', 
    path: '/api/test-models',
    needsTenant: false
  },
  {
    name: 'Listar Productos',
    method: 'GET',
    path: `/api/productos?tenant_id=${TENANT_ID}`,
    needsTenant: true
  },
  {
    name: 'Listar Usuarios',
    method: 'GET',
    path: `/api/usuarios?tenant_id=${TENANT_ID}`,
    needsTenant: true
  },
  {
    name: 'Listar Pedidos',
    method: 'GET',
    path: `/api/pedidos?tenant_id=${TENANT_ID}`,
    needsTenant: true
  },
  {
    name: 'Listar Tenants',
    method: 'GET',
    path: '/api/tenants',
    needsTenant: false
  }
];

async function testEndpoint(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: endpoint.path,
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            name: endpoint.name,
            statusCode: res.statusCode,
            success: jsonData.success !== false,
            data: jsonData
          });
        } catch (error) {
          resolve({
            name: endpoint.name,
            statusCode: res.statusCode,
            success: false,
            error: 'Invalid JSON response',
            rawData: data
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject({
        name: endpoint.name,
        error: error.message
      });
    });
    
    if (endpoint.method === 'POST' && endpoint.body) {
      req.write(JSON.stringify(endpoint.body));
    }
    
    req.end();
  });
}

async function runAllTests() {
  console.log('🚀 INICIANDO PRUEBAS DE ENDPOINTS');
  console.log('=' .repeat(50));
  
  const results = [];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n🔍 Probando: ${endpoint.name}`);
      console.log(`   ${endpoint.method} ${BASE_URL}${endpoint.path}`);
      
      const result = await testEndpoint(endpoint);
      results.push(result);
      
      const statusIcon = result.statusCode === 200 ? '✅' : '❌';
      console.log(`   ${statusIcon} Status: ${result.statusCode}`);
      
      if (result.success && result.data) {
        if (result.data.paginacion) {
          console.log(`   📊 Total registros: ${result.data.paginacion.total}`);
        } else if (Array.isArray(result.data)) {
          console.log(`   📊 Total registros: ${result.data.length}`);
        } else if (result.data.data && Array.isArray(result.data.data)) {
          console.log(`   📊 Total registros: ${result.data.data.length}`);
        }
      }
      
      // Pequeña pausa entre requests
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.error || error.message}`);
      results.push({
        name: endpoint.name,
        success: false,
        error: error.error || error.message
      });
    }
  }
  
  // Resumen
  console.log('\n' + '=' .repeat(50));
  console.log('📊 RESUMEN DE PRUEBAS');
  console.log('=' .repeat(50));
  
  const totalTests = results.length;
  const passedTests = results.filter(r => r.success).length;
  const failedTests = results.filter(r => !r.success).length;
  
  console.log(`Total pruebas: ${totalTests}`);
  console.log(`✅ Exitosas: ${passedTests}`);
  console.log(`❌ Fallidas: ${failedTests}`);
  
  if (failedTests > 0) {
    console.log('\n⚠️  Endpoints con problemas:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   • ${r.name}: ${r.error || 'Status ' + r.statusCode}`);
    });
  }
  
  // Mostrar detalles de cada endpoint
  console.log('\n📋 DETALLES POR ENDPOINT:');
  console.log('-' .repeat(50));
  
  results.forEach(result => {
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} ${result.name}`);
    
    if (result.statusCode) {
      console.log(`   Status: ${result.statusCode}`);
    }
    
    if (result.data && result.data.message) {
      console.log(`   Mensaje: ${result.data.message}`);
    }
    
    if (result.data && result.data.paginacion) {
      console.log(`   Total: ${result.data.paginacion.total} registros`);
    }
  });
  
  console.log('\n🎯 Pruebas completadas!');
}

// Verificar que el servidor esté corriendo
const checkServer = () => {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/health',
      method: 'GET',
      timeout: 2000
    }, (res) => {
      resolve(res.statusCode === 200);
    });
    
    req.on('error', () => resolve(false));
    req.on('timeout', () => resolve(false));
    req.end();
  });
};

async function main() {
  console.log('🔍 Verificando si el servidor está corriendo...');
  
  const isServerRunning = await checkServer();
  
  if (!isServerRunning) {
    console.log('❌ El servidor no está corriendo en http://localhost:3000');
    console.log('💡 Ejecuta primero: node server.js');
    process.exit(1);
  }
  
  console.log('✅ Servidor encontrado en http://localhost:3000');
  
  await runAllTests();
}

main().catch(console.error);