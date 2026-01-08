const { Client } = require('pg');

async function findConstraints() {
    const client = new Client({
        user: 'postgres',
        host: '127.0.0.1',
        database: 'FoodRushMultiTenant',
        password: 'randycairo17',
        port: 5432,
    });

    try {
        await client.connect();
        const res = await client.query("SELECT table_name, constraint_name FROM information_schema.table_constraints WHERE constraint_name LIKE '%producto%'");
        console.log('🔗 Constraints de Productos:');
        console.log(res.rows.map(r => `${r.table_name} -> ${r.constraint_name}`).join('\n'));
        await client.end();
    } catch (e) {
        console.error(e);
    }
}

findConstraints();
