import moment from "moment-timezone";
import { Admins, Products } from "../../models/realations.js";

export default {
  async create(req, res) {
    try {
      let { name, totalAmount, price } = req.body;
      let createdData = await Products.create({
        name,
        totalAmount,
        price,
        productImage: `/${req.file.path}`,
        adminId: req.admin.id,
      });

      res.status(201).json({
        createdData,
        message: "Product created successfully",
        status: 201,
      });
    } catch (error) {
      console.log(error);
    }
  },

  async find(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows } = await Products.findAndCountAll({
        where: {
          deleted: false,
        },
        include: [
          {
            model: Admins,
            attributes: ["id", "name", "lastName", "phoneNumber"],
          },
        ],
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        data: rows,
        meta: {
          totalItems: count,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
        },
        message: "Products fetched successfully",
        status: 200,
      });
    } catch (error) {
      console.log(error);
    }
  },

  async findById(req, res) {
    try {
      let { id } = req.params;
      let data = await Products.findByPk(id, {
        include: [
          {
            model: Admins,
            as: "admin", // 'admin' bo'lishi kerak, bu siz belgilagan alias
            attributes: ["id", "name", "lastName", "phoneNumber"], // adminni faqat kerakli ma'lumotlari
          },
        ],
      });

      if (!data || data.deleted) {
        return res.status(404).json({
          message: "Product not found",
          status: 404,
        });
      }

      res.status(200).json({
        data,
        message: "Product fetched successfully",
        status: 200,
      });
    } catch (error) {
      console.log(error);
    }
  },

  async sell(req, res) {
    try {
      const { id } = req.params;
      const { amount } = req.body;

      const product = await Products.findByPk(id, {
        include: [
          {
            model: Admins,
            as: "admin",
            attributes: ["id", "name"],
          },
        ],
      });

      if (!product || product.deleted) {
        return res.status(404).json({
          message: "Product not found",
          status: 404,
        });
      }

      const { totalAmount, remainingAmount } = product;

      // Stok etarlimi?
      if (remainingAmount + totalAmount < amount) {
        return res.status(400).json({
          message: "Not enough stock to complete the sale",
          status: 400,
          requestedAmount: amount,
          availableAmount: remainingAmount + totalAmount,
        });
      }

      // Sotuvni hisoblash
      let newRemainingAmount = remainingAmount;
      let newTotalAmount = totalAmount;

      if (remainingAmount >= amount) {
        newRemainingAmount -= amount;
      } else {
        const deficit = amount - remainingAmount;
        newRemainingAmount = 0;
        newTotalAmount -= deficit;
      }

      product.remainingAmount = newRemainingAmount;
      product.totalAmount = newTotalAmount;
      product.quantitySold += amount;

      // Harakatni loglash
      const newAction = {
        action: "sold",
        numberOfSales: amount,
        adminId: req.admin.id, // Admin ID'sini olamiz
        timestamp: moment().tz("Asia/Tashkent").format(),
      };

      const actionsTaken = product.actionsTaken || [];
      actionsTaken.push(newAction);
      product.actionsTaken = actionsTaken;

      // Saqlash
      await product.save();

      return res.status(200).json({
        message: "Sale completed successfully",
        status: 200,
        updatedProduct: product,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "An error occurred while processing the sale",
        status: 500,
        error: error.message,
      });
    }
  },

  async delete(req, res) {
    try {
      let { id } = req.params;
      let product = await Products.findByPk(id);

      if (!product || product.deleted) {
        return res.status(404).json({
          message: "Product not found",
          status: 404,
        });
      }

      product.deleted = true;

      const newAction = {
        action: "deleted",
        adminId: req.admin.id, // Assuming req.user contains the logged-in admin's ID
        timestamp: moment().tz("Asia/Tashkent").format(),
      };

      actionsTaken.push(newAction);
      product.actionsTaken = actionsTaken;

      await product.save();

      res.status(200).json({
        message: "Product deleted successfully",
        status: 200,
      });
    } catch (error) {
      console.log(error);
    }
  },

  async searchProduct(req, res) {
    try {
      const allowedFields = [
        "name",
        "quantitySold",
        "deleted",
        "totalAmount",
        "remainingAmount",
      ];
      const whereClause = {};

      // Dinamik `whereClause` qurish
      Object.entries(req.query).forEach(([key, value]) => {
        if (allowedFields.includes(key)) {
          if (key === "name") {
            whereClause[key] = { [Op.like]: `%${value}%` }; // Qisman moslik
          } else if (key === "deleted") {
            whereClause[key] = value === "true"; // Boolean moslik
          } else {
            whereClause[key] = value; // Aniq moslik
          }
        }
      });

      // Mahsulotlarni qidirish
      const products = await Products.findAll({
        where: whereClause,
      });

      res.status(200).json({
        status: 200,
        message: "Products fetched successfully",
        data: products,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: "An error occurred while fetching products",
        error: error.message,
      });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params; // URL parametrlari orqali id ni olish
      const { name, amount } = req.body; // Body orqali name va amountni olish

      // Mahsulotni topamiz
      const product = await Products.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: "Mahsulot topilmadi!" });
      }

      // Dynamic update: Agar name bo'lsa, uni yangilaymiz
      if (name) {
        product.name = name;
      }

      // Agar amount bo'lsa, totalAmount va remainingAmountga qo'shamiz
      if (amount) {
        product.totalAmount += amount;
        product.remainingAmount += amount;
      }

      // Narxlar va daromadlarni qayta hisoblash
      product.totalPrice = product.totalAmount * product.price;
      product.revenue = product.quantitySold * product.price;

      const newAction = {
        action: "update product name or amount",
        adminId: req.admin.id, // Assuming req.user contains the logged-in admin's ID
        timestamp: moment().tz("Asia/Tashkent").format(),
      };

      actionsTaken.push(newAction);
      product.actionsTaken = actionsTaken;

      // Mahsulotni yangilaymiz
      await product.save();

      res.status(200).json({
        message: "Mahsulot muvaffaqiyatli yangilandi!",
        product,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Xatolik yuz berdi!" });
    }
  },
};
