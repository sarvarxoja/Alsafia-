import { DataTypes, Model } from "sequelize";
import newSequlize from "../../config/index.js";

export class DealsStatModel extends Model {}

DealsStatModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    system_id: {
      type: DataTypes.STRING,
      defaultValue: null,
    },

    totalDeals: {
      type: DataTypes.BIGINT,
    },

    totalSales: {
      type: DataTypes.STRING,
    },

    percentage: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: newSequlize,
    modelName: "DealsStats",
    timestamps: true,
  }
);
