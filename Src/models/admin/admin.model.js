import { Model, DataTypes } from "sequelize";
import newSequlize from "../../config/index.js";

export class Admins extends Model {}

Admins.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    lastName: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phoneNumber: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        len: [10, 15], // Minimal uzunlik: 10, Maksimal uzunlik: 15
      },
    },

    tokenVersion: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    supperAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    role: {
      type: DataTypes.STRING,
      defaultValue: "unknown",
    },

    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    lastLogin: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    sequelize: newSequlize,
    tableName: "Admins",
  }
);
