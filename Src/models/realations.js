import { Users } from "./users/users.model.js";
import { Admins } from "./admin/admin.model.js";
import { Products } from "./products/products.model.js";

Admins.hasMany(Products, { foreignKey: "adminId" });
Products.belongsTo(Admins, { foreignKey: "adminId" });

// Users.sync({ alter: true });

// Admins.sync({ alter: true });

// Products.sync({ alter: true });

export { Users, Admins, Products };
