const { pedidos, pedidoitems, productosvariantes } = require("../models");

module.exports = {
    // POST /api/pedidos
    async create(req, res) {
        const { tenant_id, sucursal_id, cliente_id, usuario_id, items } = req.body;

        try {
            const pedido = await pedidos.create({
                tenant_id,
                sucursal_id,
                cliente_id,
                usuario_id,
                total: 0,
                estado_id: 1
            });

            let total = 0;

            for (const item of items) {
                const variante = await productosvariantes.findByPk(item.variante_id);
                const subtotal = variante.precio * item.cantidad;

                total += subtotal;

                await pedidoitems.create({
                    pedido_id: pedido.id,
                    producto_id: variante.producto_id,
                    variante_id: variante.id,
                    cantidad: item.cantidad,
                    precio_unitario: variante.precio,
                    subtotal
                });
            }

            pedido.total = total;
            await pedido.save();

            res.json({ message: "Pedido creado", pedido_id: pedido.id });
        } catch (error) {
            console.error("Error creando pedido:", error);
            res.status(500).json({ error: "Error creando pedido" });
        }
    },

    // GET /api/pedidos/:tenant_id
    async list(req, res) {
        try {
            const data = await pedidos.findAll({
                where: { tenant_id: req.params.tenant_id }
            });
            res.json(data);
        } catch (error) {
            console.error("Error listando pedidos:", error);
            res.status(500).json({ error: "Error listando pedidos" });
        }
    }
};
