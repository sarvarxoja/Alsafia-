import moment from "moment-timezone";
import { Products, Users } from "../../models/realations.js";

export default {
  async getProductsData(req, res) {
    try {
      const startOfWeek = moment().startOf("week").tz("Asia/Tashkent").format();
      const startOfYear = moment().startOf("year").tz("Asia/Tashkent").format();
      const startOfDay = moment().startOf("day").tz("Asia/Tashkent").format();

      // Jami mahsulotlar sonini olish
      const totalProducts = await Products.count({
        where: { deleted: false },
      });

      // Mahsulotlar statistikasi (remainingAmount va price bilan birga)
      const salesStats = await Products.findAll({
        where: { deleted: false },
        attributes: ["id", "name", "actionsTaken", "remainingAmount"],
      });

      let weeklySales = 0;
      let yearlySales = 0;
      let dailySales = 0;
      let totalRemainingAmount = 0; // Qolgan mahsulotlar miqdori

      salesStats.forEach((product) => {
        const actions = product.actionsTaken || [];
        actions.forEach((action) => {
          if (action.action === "sold") {
            const saleDate = moment(action.timestamp);

            if (saleDate.isSameOrAfter(startOfWeek)) {
              weeklySales += action.numberOfSales;
            }

            if (saleDate.isSameOrAfter(startOfYear)) {
              yearlySales += action.numberOfSales;
            }

            if (saleDate.isSameOrAfter(startOfDay)) {
              dailySales += action.numberOfSales;
            }
          }
        });

        // Qolgan mahsulotlar miqdorini va narxini hisoblash
        totalRemainingAmount += product.remainingAmount || 0;
      });

      // Javobni qaytarish
      return res.status(200).json({
        totalProducts,
        weeklySales,
        yearlySales,
        dailySales,
        totalRemainingAmount, // Jami qolgan mahsulotlar soni
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
        status: 500,
      });
    }
  },

  async getEmployeeStats(req, res) {
    try {
      // Umumiy xodimlar soni
      const totalEmployees = await Users.count();

      // Lavozim bo'yicha guruhlangan sonlar
      const positionCounts = await Users.findAll({
        attributes: [
          "position",
          [
            Users.sequelize.fn("COUNT", Users.sequelize.col("position")),
            "count",
          ],
        ],
        group: ["position"],
      });

      // salaryType bo'yicha guruhlangan sonlar
      const salaryTypeCounts = await Users.findAll({
        attributes: [
          "salaryType",
          [
            Users.sequelize.fn("COUNT", Users.sequelize.col("salaryType")),
            "count",
          ],
        ],
        group: ["salaryType"],
      });

      // Lavozim bo'yicha obyekt yaratish
      const positionCountsObject = {};
      positionCounts.forEach((pos) => {
        positionCountsObject[pos.position] = parseInt(pos.dataValues.count, 10);
      });

      // salaryType bo'yicha obyekt yaratish
      const salaryTypeCountsObject = {};
      salaryTypeCounts.forEach((type) => {
        salaryTypeCountsObject[type.salaryType] = parseInt(
          type.dataValues.count,
          10
        );
      });

      // Natijalarni qaytarish
      return res.status(200).json({
        totalEmployees,
        positionCounts: positionCountsObject,
        salaryTypeCounts: salaryTypeCountsObject,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
        status: 500,
      });
    }
  },
};