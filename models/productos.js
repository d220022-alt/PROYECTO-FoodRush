module.exports = (sequelize, DataTypes) => {
  const Producto = sequelize.define(
    "productos",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      tenant_id: DataTypes.BIGINT,
      categoria_id: DataTypes.BIGINT,
      nombre: DataTypes.STRING,
      descripcion: DataTypes.TEXT,
      precio: DataTypes.DECIMAL,
      activo: DataTypes.BOOLEAN,
    },
    {
      tableName: "productos",
      timestamps: false,
    }
  );

  Producto.associate = (models) => {
    console.log('DEBUG ASSOCIATE: Productos. Models:', Object.keys(models));
    if (!models.productos_imagenes) console.error('CRITICAL: productos_imagenes MISSING in associate!');

    Producto.hasMany(models.productosvariantes, {
      foreignKey: "producto_id",
      as: "variantes",
    });

    Producto.belongsTo(models.categorias, {
      foreignKey: "categoria_id",
      as: "categoria",
    });

    Producto.hasMany(models.productos_imagenes, {
      foreignKey: "producto_id",
      as: "imagenes",
    });
  };

  return Producto;
};
