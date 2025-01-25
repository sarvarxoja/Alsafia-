import { DataTypes, Model } from "sequelize";
import newSequlize from "../../config/index.js";

export class ContactStatModel extends Model {}

ContactStatModel.init(
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

    totalContacts: {
      type: DataTypes.BIGINT,
    },

    connected: {
      type: DataTypes.BIGINT,
    },

    notConnected: {
      type: DataTypes.BIGINT,
    },

    connectedPercentage: {
      type: DataTypes.STRING,
    },

    notConnectedPercentage: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: newSequlize,
    modelName: "ContactStats",
    timestamps: true,
  }
);
