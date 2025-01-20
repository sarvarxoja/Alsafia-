import { Users } from "./users/users.model.js";
import { Admins } from "./admin/admin.model.js";
import { Products } from "./products/products.model.js";

Admins.hasMany(Products, { foreignKey: "adminId" });
Products.belongsTo(Admins, { foreignKey: "adminId" });

Users.sync({ alter: true }).then(() => {
    console.log('Users model is synchronized');
  }).catch(err => {
    console.error('Error syncing Users model:', err);
  });
  
  Admins.sync({ alter: true }).then(() => {
    console.log('Admins model is synchronized');
  }).catch(err => {
    console.error('Error syncing Admins model:', err);
  });
  
  Products.sync({ alter: true }).then(() => {
    console.log('Products model is synchronized');
  }).catch(err => {
    console.error('Error syncing Products model:', err);
  });
  

export { Users, Admins, Products };
