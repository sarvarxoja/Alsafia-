import { DataTypes, Model } from "sequelize";
import newSequlize from "../../config/index.js";

export class Products extends Model {}

Products.init(
  {
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    productImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    quantitySold: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    remainingAmount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    totalAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    actionsTaken: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },

    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    revenue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    adminId: {
      type: DataTypes.UUID,
      allowNull: false,       
      references: {
        model: "Admins",
        key: "id",
      },
    },
  },
  {
    sequelize: newSequlize,
    modelName: "Products",
    hooks: {
      beforeCreate: (product, options) => {
        product.totalPrice = product.totalAmount * product.price;
        product.revenue = product.quantitySold * product.price;
      },
      beforeUpdate: (product, options) => {
        product.totalPrice = product.totalAmount * product.price;
        product.revenue = product.quantitySold * product.price;
      },
    },
  }
);
