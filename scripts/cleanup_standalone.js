const { Client } = require('pg');
require('dotenv').config();

async function cleanup() {
    console.log('🚀 Iniciando limpieza de tenant duplicado...');

    const client = new Client({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || '127.0.0.1',
        database: process.env.DB_NAME || 'FoodRushMultiTenant',
        password: process.env.DB_PASS || process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT) || 5432,
    });

    try {
        await client.connect();
        console.log('🔌 Conectado a la base de datos.');

        // Verificar qué vamos a borrar primero
        const check = await client.query("SELECT * FROM tenants WHERE nombre = 'Starbucks'");
        console.log(`🔍 Encontrados ${check.rowCount} tenants con nombre 'Starbucks'.`);

        if (check.rowCount > 0) {
            const tenantId = check.rows[0].id;
            console.log(`🗑️ Eliminando datos relacionados al Tenant ID ${tenantId}...`);

            // 1. Borrar imagenes de productos
            await client.query("DELETE FROM productos_imagenes WHERE tenant_id = $1", [tenantId]);
            // 2. Borrar variantes
            // await client.query("DELETE FROM productos_variantes WHERE producto_id IN (SELECT id FROM productos WHERE tenant_id = $1)", [tenantId]); 
            // Como no tenemos modelo variantes cargado, asumo cascada o tabla simple. Intentemos borrar productos directo si la BD tiene cascada, sino paso a paso.

            // 3. Borrar items de pedidos y pedidos
            await client.query("DELETE FROM pedidoitems WHERE pedido_id IN (SELECT id FROM pedidos WHERE tenant_id = $1)", [tenantId]);
            await client.query("DELETE FROM pedidos WHERE tenant_id = $1", [tenantId]);

            // 4. Borrar Usuarios
            await client.query("DELETE FROM usuarios WHERE tenant_id = $1", [tenantId]);

            // 5. Borrar Productos
            await client.query("DELETE FROM productos WHERE tenant_id = $1", [tenantId]);

            // 4. Borrar Categorias
            await client.query("DELETE FROM categorias WHERE tenant_id = $1", [tenantId]);

            // 5. Finalmente borrar el tenant
            const res = await client.query("DELETE FROM tenants WHERE id = $1 RETURNING *", [tenantId]);
            console.log(`✅ Tenant eliminado: ID ${res.rows[0].id} - ${res.rows[0].nombre}`);
        } else {
            console.log('ℹ️ No hay nada que borrar.');
        }

        await client.end();
        process.exit(0);
    } catch (e) {
        console.error('❌ Error fatal:', e);
        process.exit(1);
    }
}

cleanup();
