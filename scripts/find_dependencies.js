const { Client } = require('pg');

async function findDependencies() {
    const client = new Client({
        user: 'postgres',
        host: '127.0.0.1',
        database: 'FoodRushMultiTenant',
        password: 'randycairo17',
        port: 5432,
    });

    try {
        await client.connect();
        const res = await client.query("SELECT table_name FROM information_schema.columns WHERE column_name = 'tenant_id' AND table_schema = 'public'");
        console.log('🔗 Tablas con tenant_id:');
        console.log(res.rows.map(r => r.table_name).join('\n'));
        await client.end();
    } catch (e) {
        console.error(e);
    }
}

findDependencies();
