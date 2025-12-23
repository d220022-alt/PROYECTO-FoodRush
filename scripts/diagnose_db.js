const db = require('../models');

async function diagnose() {
    const t = await db.sequelize.transaction();
    try {
        console.log('🔍 Starting Database Diagnosis...');

        // 1. Verify Models Existence
        console.log('   Checking Models...');
        const requiredModels = ['pedidos', 'pedidoitems', 'facturas', 'pagos', 'metodospago', 'clientes'];
        let missing = false;
        requiredModels.forEach(m => {
            if (!db[m]) {
                console.error(`   ❌ Model '${m}' NOT found in db object.`);
                missing = true;
            } else {
                console.log(`      ✅ Model '${m}' loaded.`);
            }
        });

        if (missing) throw new Error('Missing models');

        // 2. Attempt Dummy Creation (Validation Test)
        console.log('\n   🧪 Attempting Transactional Creation...');

        // Dummy Data
        const tenantId = 1;
        const clientId = 1; // Assuming 1 exists or fails foreign key
        const total = 100.00;

        // A. Create Pedido
        console.log('      👉 Creating Pedido...');
        const pedido = await db.pedidos.create({
            tenant_id: tenantId,
            cliente_id: clientId,
            estado_id: 1,
            total: total,
            creado_en: new Date()
        }, { transaction: t });
        console.log(`         ✅ Pedido created ID: ${pedido.id}`);

        // B. Create Items
        console.log('      👉 Creating Items...');
        // Fetch valid product
        const product = await db.productos.findOne();
        if (!product) throw new Error("No products found to test with.");
        const productId = product.id;
        console.log(`      ✅ Using Product ID: ${productId}`);

        await db.pedidoitems.create({
            pedido_id: pedido.id,
            producto_id: productId,
            cantidad: 1,
            precio_unitario: 100,
            subtotal: 100
        }, { transaction: t });
        console.log(`         ✅ Item created`);

        // C. Create Factura
        console.log('      👉 Creating Factura...');
        const factura = await db.facturas.create({
            tenant_id: tenantId,
            pedido_id: pedido.id,
            total: total,
            creado_en: new Date()
        }, { transaction: t });
        console.log(`         ✅ Factura created`);

        // D. Create Pago
        console.log('      👉 Creating Pago...');
        await db.pagos.create({
            pedido_id: pedido.id,
            factura_id: factura.id,
            metodo_id: 1, // Cash from init_payment_methods
            monto: total,
            estado: 'Diagnostic Test',
            creado_en: new Date()
        }, { transaction: t });
        console.log(`         ✅ Pago created`);

        // Rollback test - we don't want to keep junk data
        console.log('\n   🛑 Rolling back test transaction (SUCCESS if we got here).');
        await t.rollback();
        console.log('   ✅ Diagnosis Passed: All relations seem valid in code.');

    } catch (error) {
        console.error('\n   ❌ Diagnosis FAILED:');
        console.error('   Error Name:', error.name);
        console.error('   Error Message:', error.message);
        if (error.original) {
            console.error('   SQL Error:', error.original.sqlMessage || error.original.message);
            console.error('   SQL Code:', error.original.code);
        }
        if (t) await t.rollback();
    } finally {
        process.exit(0);
    }
}

diagnose();
