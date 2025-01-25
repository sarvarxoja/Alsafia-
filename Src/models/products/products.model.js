import { DataTypes, Model } from "sequelize";
import newSequlize from "../../config/index.js";

export class Products extends Model {}

Products.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    productImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    quantitySold: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },

    remainingAmount: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },

    totalAmount: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    price: {
      type: DataTypes.ARRAY(DataTypes.BIGINT),
      allowNull: false,
    },

    actionsTaken: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },

    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    revenue: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },

    cost: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },

    currency: {
      type: DataTypes.STRING,
      defaultValue: "SUM",
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
    // hooks: {
    //   beforeCreate: (product, options) => {
    //     product.totalPrice = product.totalAmount * product.price;
    //     product.revenue = product.quantitySold * product.price;
    //   },
    //   beforeUpdate: (product, options) => {
    //     if (product.changed('quantitySold')) {
    //       product.revenue = product.quantitySold * product.price;
    //     }
    //     product.totalPrice = product.totalAmount * product.price;
    //   },
    // },
  }
);
