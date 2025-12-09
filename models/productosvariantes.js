"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class productosvariantes extends Model {
    static associate(models) {
      productosvariantes.belongsTo(models.productos, {
        foreignKey: "producto_id",
        as: "producto",
      });
    }
  }

  productosvariantes.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      producto_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      precio: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      precio_adicional: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "productosvariantes",
      tableName: "productosvariantes",
      timestamps: false, // MUY IMPORTANTE porque tu tabla NO tiene created_at ni updated_at
    }
  );

  return productosvariantes;
};
