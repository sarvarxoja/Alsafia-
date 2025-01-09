import { Sequelize } from "sequelize";

const DB = process.env.DB;

const newSequlize = new Sequelize(DB, {
  logging: false,
});

!(async function () {
  try {
    await newSequlize.authenticate();
    console.log("successfully");
  } catch (error) {
    console.error(error.message);
  }
})();

export default newSequlize;
