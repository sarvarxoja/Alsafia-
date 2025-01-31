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

    system_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true, // `defaultValue: null` o‘rniga qo‘llanadi
      defaultValue: null,
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
      type: DataTypes.STRING,
      defaultValue: null,
    },

    phoneNumber: {
      type: DataTypes.STRING,
      defaultValue: null,
    },

    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true, // Email formatini tekshirish
      },
    },

    task: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },

    dateOfBirth: {
      type: DataTypes.STRING,
      defaultValue: null,
    },

    parentName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    salaryType: {
      type: DataTypes.ENUM(
        "stable",
        "percentage",
        "unknown",
        "stable_and_percentage"
      ),
      allowNull: true,
    },

    comment: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    registered: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    isOnline: {
      type: DataTypes.BOOLEAN, // BOOLEAN turidan foydalanildi
      defaultValue: false,
    },

    lastLogin: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    sequelize: newSequlize,
    tableName: "Employees",
    timestamps: true, // Agar kerak bo‘lmasa, `false` qilib qo‘ying
  }
);
