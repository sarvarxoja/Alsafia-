import { Model, DataTypes } from "sequelize";
import newSequlize from "../../config/index.js";

export class Users extends Model {}

Users.init(
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

    position: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    dateOfEmployment: {
      type: DataTypes.DATE, // `String` ni `DATE`ga o'zgartirdim
      allowNull: false,
    },

    phoneNumber: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        len: [10, 15], // Minimal uzunlik: 10, Maksimal uzunlik: 15
      },
    },

    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    parentName: {
      type: DataTypes.STRING,
    },

    salaryType: {
      type: DataTypes.ENUM("stable", "percentage"),
      allowNull: true,
    },

    comment: {
      type: DataTypes.STRING(500),
    },
  },
  {
    sequelize: newSequlize,
    tableName: "Employees",
  }
);
