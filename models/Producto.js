module.exports = (sequelize, DataTypes) => {
    const Producto = sequelize.define(
        "Producto",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            tenantId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            categoriaId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            sku: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            nombre: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            descripcion: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            precio: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
            activo: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            creadoEn: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "productos",
            timestamps: false,
        }
    );

    Producto.associate = (models) => {
        Producto.belongsTo(models.Categoria, {
            foreignKey: "categoriaId",
            as: "categoria",
        });

        Producto.belongsTo(models.Tenant, {
            foreignKey: "tenantId",
            as: "tenant",
        });
    };

    return Producto;
};
