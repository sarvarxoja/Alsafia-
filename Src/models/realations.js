import { Users } from "./users/users.model.js";
import { Admins } from "./admin/admin.model.js";
import { Products } from "./products/products.model.js";
import { DealsStatModel } from "./statistc/DealStat.model.js";
import { ContactStatModel } from "./statistc/ContactStat.model.js";

Admins.hasMany(Products, { foreignKey: "adminId" });
Products.belongsTo(Admins, { foreignKey: "adminId" });

// Users.sync({ force: true });

// Admins.sync({ alter: true });

// Products.sync({ force: true });

// ContactStatModel.sync({ force: true });

// DealsStatModel.sync({ force: true });

export { Users, Admins, Products, DealsStatModel, ContactStatModel };
