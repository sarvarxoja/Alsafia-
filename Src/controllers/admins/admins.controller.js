import { Op } from "sequelize";
import { Admins } from "../../models/realations.js";
import { encodePassword } from "../../utils/bcrypt/bcrypt.js";

export default {
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows: admins } = await Admins.findAndCountAll({
        where: {
          id: { [Op.ne]: req.admin.id },
          deleted: false,
        },
        attributes: { exclude: ["password", "tokenVersion"] }, // Passwordni chiqarib tashlaymiz
        offset,
        limit,
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        success: true,
        totalAdmins: count, // Umumiy adminlar soni
        totalPages: Math.ceil(count / limit), // Umumiy sahifalar soni
        currentPage: page, // Hozirgi sahifa raqami
        admins, // Adminlar ro‘yxati
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
        status: 500,
      });
    }
  },

  async getById(req, res) {
    try {
      let { id } = req.params;

      let admin = await Admins.findOne({
        where: { id: id },
        attributes: { exclude: ["password", "tokenVersion"] },
      });

      if (!admin) {
        return res
          .status(404)
          .json({ message: "Admin not found", status: 404 });
      }

      let your = false;

      if (req.admin.id === admin.id) {
        your = true;
      }

      res.status(200).json({ admin, isYour: your, status: 200 });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
        status: 500,
      });
    }
  },

  async search(req, res) {
    const { query, type } = req.query;

    if (!query || !type) {
      return res
        .status(400)
        .json({ message: "Both query and type parameters are required" });
    }

    try {
      let whereClause = {};

      if (type === "name") {
        whereClause = {
          name: {
            [Op.iLike]: `%${query}%`,
          },
        };
      } else {
        return res
          .status(400)
          .json({ message: 'Invalid search type. Use "name" or "position".' });
      }

      const users = await Admins.findAll({
        where: whereClause,
        attributes: { exclude: ["password", "tokenVersion"] },
      });

      return res.json(users);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
        status: 500,
      });
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const updates = req.body;

    try {
      const validFields = Object.keys(Admins.rawAttributes);
      const invalidFields = Object.keys(updates).filter(
        (field) => !validFields.includes(field)
      );

      if (invalidFields.length > 0) {
        return res.status(400).json({
          error: `Invalid fields in request: ${invalidFields.join(", ")}`,
        });
      }

      // 2. Userni topish
      const admin = await Admins.findByPk(id);
      if (!admin) {
        return res.status(404).json({ error: "User not found" });
      }

      if (updates.password) {
        updates.password = await encodePassword(updates.password);
      }

      if (updates.password) {
        updates.tokenVersion = admin.tokenVersion + 1;
      }

      await admin.update(updates);

      res
        .status(200)
        .json({ message: "User updated successfully", data: admin });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
        status: 500,
      });
    }
  },

  async profileMe(req, res) {
    try {
      let myData = await Admins.findOne({
        where: { id: req.admin.id },
        attributes: { exclude: ["password", "tokenVersion"] },
      });

      res.status(200).json({ myData, status: 200 });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
        status: 500,
      });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const admin = await Admins.findByPk(id);

      if (!admin || admin.deleted) {
        return res.status(404).json({
          message: "admin not found",
          status: 404,
        });
      }

      await admin.update(
        {
          deleted: true,
        },
        {
          fields: ["deleted"],
        }
      );

      res.status(200).json({
        message: "Admin deleted successfully",
        status: 200,
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
