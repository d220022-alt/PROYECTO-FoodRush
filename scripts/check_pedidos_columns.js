const { sequelize } = require('../models');

async function checkColumns() {
    try {
        console.log('🔍 Querying columns for table "pedidos"...');
        const [results, metadata] = await sequelize.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'pedidos';
        `);
        console.log('COLUMNS:', JSON.stringify(results.map(r => r.column_name)));
    } catch (error) {
        console.error('Error querying columns:', error);
    } finally {
        process.exit(0);
    }
}

checkColumns();
