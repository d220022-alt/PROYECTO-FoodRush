const { sequelize } = require('../models');

async function listSchema() {
    try {
        const queryInterface = sequelize.getQueryInterface();
        const description = await queryInterface.describeTable('pedidos');
        console.log('PEDIDOS_COLUMNS_START');
        console.log(JSON.stringify(Object.keys(description)));
        console.log('PEDIDOS_COLUMNS_END');
    } catch (error) {
        console.error('Error listing schema:', error);
    } finally {
        process.exit(0);
    }
}

listSchema();
