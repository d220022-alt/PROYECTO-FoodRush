const http = require('http');

function request(path, headers = {}) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'GET',
            headers: { 'Content-Type': 'application/json', ...headers }
        };
        const req = http.request(options, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.on('error', reject);
        req.end();
    });
}

async function debug() {
    try {
        console.log('1. Fetching Tenants...');
        const tenantsRes = await request('/api/tenants');
        const starbucks = tenantsRes.data.find(t => t.nombre === 'Starbucks');

        if (!starbucks) {
            console.error('❌ Starbucks tenant not found!');
            return;
        }
        console.log(`✅ Found Starbucks ID: ${starbucks.id}`);

        console.log('2. Fetching Products...');
        const productsRes = await request('/api/productos?limit=100', { 'X-Tenant-ID': starbucks.id });

        console.log(`✅ Products Found: ${productsRes.data.length}`);

        if (productsRes.data.length > 0) {
            console.log('🔎 First Product Sample:', JSON.stringify(productsRes.data[0], null, 2));
        }

        // Analyze Categories
        const categories = {};
        productsRes.data.forEach(p => {
            const cat = p.category || 'Uncategorized';
            categories[cat] = (categories[cat] || 0) + 1;
        });
        console.log('📊 Categories Distribution:', categories);

    } catch (e) {
        console.error('❌ Error:', e);
    }
}

debug();
