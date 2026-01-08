const { Client } = require('pg');

async function cleanup() {
    console.log('🚀 Iniciando limpieza INTELIGENTE de tenant duplicado...');

    const client = new Client({
        user: 'postgres',
        host: '127.0.0.1',
        database: 'FoodRushMultiTenant',
        password: 'randycairo17',
        port: 5432,
    });

    try {
        await client.connect();

        // 1. Encontrar el ID del tenant duplicado "Starbucks"
        // Aseguramos que NO sea el "Starbucks Coffee" (original)
        const check = await client.query("SELECT id FROM tenants WHERE nombre = 'Starbucks'");
        if (check.rowCount === 0) {
            console.log('✅ No existe el tenant "Starbucks". Todo limpio.');
            process.exit(0);
        }
        const tenantId = check.rows[0].id;
        console.log(`🎯 Objetivo: Tenant ID ${tenantId}`);

        // ==========================================
        // BORRADO EN ORDEN DE DEPENDENCIA
        // ==========================================

        console.log('🔥 1. Borrando productosopciones...');
        await client.query("DELETE FROM productosopciones WHERE grupo_id IN (SELECT id FROM productosopcionesgrupo WHERE tenant_id = $1)", [tenantId]);

        console.log('🔥 2. Borrando productosopcionesgrupo...');
        await client.query("DELETE FROM productosopcionesgrupo WHERE tenant_id = $1", [tenantId]);

        console.log('🔥 3. Borrando pedidoitemopciones...');
        await client.query("DELETE FROM pedidoitemopciones WHERE pedidoitem_id IN (SELECT id FROM pedidoitems WHERE pedido_id IN (SELECT id FROM pedidos WHERE tenant_id = $1))", [tenantId]);

        console.log('🔥 4. Borrando pedidoitems...');
        // Borrar por pedido (pertenecientes al tenant)
        await client.query("DELETE FROM pedidoitems WHERE pedido_id IN (SELECT id FROM pedidos WHERE tenant_id = $1)", [tenantId]);
        // Y TAMBIEN borrar por producto (si el producto pertenece al tenant, aunque el pedido sea de otro o huérfano)
        await client.query("DELETE FROM pedidoitems WHERE producto_id IN (SELECT id FROM productos WHERE tenant_id = $1)", [tenantId]);

        console.log('🔥 5. Borrando pedidos...');
        await client.query("DELETE FROM pedidos WHERE tenant_id = $1", [tenantId]);

        console.log('🔥 6. Borrando productosvariantes...');
        await client.query("DELETE FROM productosvariantes WHERE producto_id IN (SELECT id FROM productos WHERE tenant_id = $1)", [tenantId]);

        console.log('🔥 7. Borrando productos_imagenes...');
        await client.query("DELETE FROM productos_imagenes WHERE tenant_id = $1", [tenantId]);

        console.log('🔥 7.1. Borrando dependencias extra de productos (impuestos)...');
        await client.query("DELETE FROM productosimpuestos WHERE producto_id IN (SELECT id FROM productos WHERE tenant_id = $1)", [tenantId]);

        console.log('🔥 7.2. Borrando favoritos de clientes (via sucursales)...');
        await client.query("DELETE FROM clientesfavoritos WHERE sucursal_id IN (SELECT id FROM sucursales WHERE tenant_id = $1)", [tenantId]);

        console.log('🔥 8. Borrando productos...');
        await client.query("DELETE FROM productos WHERE tenant_id = $1", [tenantId]);

        console.log('🔥 9. Borrando categorias...');
        await client.query("DELETE FROM categorias WHERE tenant_id = $1", [tenantId]);

        console.log('🔥 10. Borrando usuarios...');
        await client.query("DELETE FROM usuarios WHERE tenant_id = $1", [tenantId]);

        // 11. CUALQUIER OTRA TABLA con tenant_id (Generic sweep)
        const res = await client.query("SELECT table_name FROM information_schema.columns WHERE column_name = 'tenant_id' AND table_schema = 'public' AND table_name != 'tenants'");
        const tables = res.rows.map(r => r.table_name);

        // Tablas ya manejadas explícitamente
        const handled = ['productos_imagenes', 'productos_variantes', 'pedidos', 'productos', 'categorias', 'usuarios', 'productosopcionesgrupo'];

        for (const t of tables) {
            if (!handled.includes(t)) {
                try {
                    await client.query(`DELETE FROM ${t} WHERE tenant_id = $1`, [tenantId]);
                    console.log(`   - Limpiado genérico: ${t}`);
                } catch (err) {
                    console.log(`   ⚠️ Error borrando ${t} (posible FK compleja), se intentó.`);
                }
            }
        }

        // 12. Finalmente borrar el tenant
        console.log('🏁 Borrando Tenant principal...');
        await client.query("DELETE FROM tenants WHERE id = $1", [tenantId]);

        console.log('✅✅✅ LIMPIEZA COMPLETADA CON ÉXITO.');

        await client.end();
        process.exit(0);
    } catch (e) {
        console.error('❌ Error fatal:', e);
        process.exit(1);
    }
}

cleanup();
