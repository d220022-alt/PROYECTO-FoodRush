const { Op } = require('sequelize');

class GenericController {
    constructor(model) {
        this.model = model;
        this.modelName = model.name;
        this.hasTenantId = !!model.rawAttributes.tenant_id;
    }

    // GET /api/:resource - Listar todos
    listar = async (req, res) => {
        try {
            console.log(`🔍 Listando ${this.modelName}...`);

            const options = {
                limit: 100,
                order: [['id', 'DESC']] // Asumimos que todos tienen ID por ahora
            };

            if (this.hasTenantId) {
                options.where = { tenant_id: req.tenantId };
                console.log(`   --> Filtrando por tenant: ${req.tenantId}`);
            }

            // Si el modelo tiene columna 'activo', filtramos solo los activos
            if (this.model.rawAttributes.activo) {
                options.where = { ...options.where, activo: true };
            }

            const data = await this.model.findAll(options);

            res.json({
                success: true,
                count: data.length,
                data: data
            });

        } catch (error) {
            console.error(`❌ Error en listar ${this.modelName}:`, error);
            res.status(500).json({
                success: false,
                error: 'SERVER_ERROR',
                message: error.message
            });
        }
    };

    // GET /api/:resource/:id - Obtener uno por ID
    obtener = async (req, res) => {
        try {
            const { id } = req.params;
            const options = { where: { id } };

            if (this.hasTenantId) {
                options.where.tenant_id = req.tenantId;
            }

            const item = await this.model.findOne(options);

            if (!item) {
                return res.status(404).json({
                    success: false,
                    error: 'NOT_FOUND',
                    message: `${this.modelName} no encontrado`
                });
            }

            res.json({
                success: true,
                data: item
            });

        } catch (error) {
            console.error(`Error obteniendo ${this.modelName}:`, error);
            res.status(500).json({
                success: false,
                error: 'SERVER_ERROR',
                message: error.message
            });
        }
    };

    // POST /api/:resource - Crear uno nuevo
    crear = async (req, res) => {
        try {
            const payload = req.body;

            if (this.hasTenantId) {
                payload.tenant_id = req.tenantId;
            }

            const nuevoItem = await this.model.create(payload);

            res.status(201).json({
                success: true,
                message: `${this.modelName} creado exitosamente`,
                data: nuevoItem
            });

        } catch (error) {
            console.error(`Error creando ${this.modelName}:`, error);
            res.status(400).json({ // 400 porque suele ser error de validación
                success: false,
                error: 'VALIDATION_ERROR',
                message: error.message
            });
        }
    };

    // PUT /api/:resource/:id - Actualizar
    actualizar = async (req, res) => {
        try {
            const { id } = req.params;
            const options = { where: { id } };

            if (this.hasTenantId) {
                options.where.tenant_id = req.tenantId;
            }

            const item = await this.model.findOne(options);

            if (!item) {
                return res.status(404).json({
                    success: false,
                    error: 'NOT_FOUND',
                    message: `${this.modelName} no encontrado`
                });
            }

            // Evitar que cambien el tenant_id o id si lo mandan en el body
            delete req.body.id;
            delete req.body.tenant_id;

            await item.update(req.body);

            res.json({
                success: true,
                message: `${this.modelName} actualizado`,
                data: item
            });

        } catch (error) {
            console.error(`Error actualizando ${this.modelName}:`, error);
            res.status(500).json({
                success: false,
                error: 'SERVER_ERROR',
                message: error.message
            });
        }
    };

    // DELETE /api/:resource/:id - Eliminar (Soft delete si tiene 'activo', Hard delete si no)
    eliminar = async (req, res) => {
        try {
            const { id } = req.params;
            const options = { where: { id } };

            if (this.hasTenantId) {
                options.where.tenant_id = req.tenantId;
            }

            const item = await this.model.findOne(options);

            if (!item) {
                return res.status(404).json({
                    success: false,
                    error: 'NOT_FOUND',
                    message: `${this.modelName} no encontrado`
                });
            }

            // Si tiene campo 'activo', hacemos soft delete
            if (this.model.rawAttributes.activo) {
                await item.update({ activo: false });
                res.json({
                    success: true,
                    message: `${this.modelName} desactivado (Soft Delete)`
                });
            } else {
                // Hard delete
                await item.destroy();
                res.json({
                    success: true,
                    message: `${this.modelName} eliminado permanentemente`
                });
            }

        } catch (error) {
            console.error(`Error eliminando ${this.modelName}:`, error);
            res.status(500).json({
                success: false,
                error: 'SERVER_ERROR',
                message: error.message
            });
        }
    };
}

module.exports = GenericController;
