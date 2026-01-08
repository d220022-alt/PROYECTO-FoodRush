const { Client } = require('pg');

async function findFKs() {
    const client = new Client({
        user: 'postgres',
        host: '127.0.0.1',
        database: 'FoodRushMultiTenant',
        password: 'randycairo17',
        port: 5432,
    });

    try {
        await client.connect();
        const res = await client.query(`
            SELECT 
                tc.table_name, 
                kcu.column_name, 
                ccu.table_name AS foreign_table_name
            FROM 
                information_schema.table_constraints AS tc 
                JOIN information_schema.key_column_usage AS kcu
                  ON tc.constraint_name = kcu.constraint_name
                  AND tc.table_schema = kcu.table_schema
                JOIN information_schema.constraint_column_usage AS ccu
                  ON ccu.constraint_name = tc.constraint_name
                  AND ccu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY' AND ccu.table_name = 'productos';
        `);
        console.log('🔗 Tablas que apuntan a "productos":');
        console.log(res.rows.map(r => `${r.table_name}.${r.column_name} -> productos`).join('\n'));
        await client.end();
    } catch (e) {
        console.error(e);
    }
}

findFKs();
