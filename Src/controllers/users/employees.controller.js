import ExcelJS from "exceljs";
import { Op } from "sequelize";
import { Users } from "../../models/realations.js";

export default {
  async create(req, res) {
    try {
      let {
        name,
        lastName,
        position,
        dateOfEmployment,
        phoneNumber,
        dateOfBirth,
        parentName,
        salaryType,
        comment,
      } = req.body;

      let createdData = await Users.create({
        name: name,
        lastName: lastName,
        position: position,
        dateOfEmployment: dateOfEmployment,
        phoneNumber: phoneNumber,
        dateOfBirth: dateOfBirth,
        parentName: parentName,
        salaryType: salaryType,
        comment: comment,
      });

      res.status(201).json({
        createdData,
        message: "Employee created successfully",
        status: 201,
      });
    } catch (error) {
      res.status(500)
      .json({
        message: "Internal server error",
        error: error.message,
        status: 500,
      });
    }
  },

  async find(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows } = await Users.findAndCountAll({
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
      });
    } catch (error) {
      res.status(500)
      .json({
        message: "Internal server error",
        error: error.message,
        status: 500,
      });
    }
  },

  async findById(req, res) {
    try {
      let { id } = req.params;
      let employee = await Users.findOne({ where: { id: id } });

      if (!employee) {
        return res.status(404).json({ msg: "Employee not found", status: 404 });
      }

      res.status(200).json({ employee, status: 200 });
    } catch (error) {
      res.status(500)
      .json({
        message: "Internal server error",
        error: error.message,
        status: 500,
      });
    }
  },

  async update(req, res) {
    const { id } = req.params; // URL dan foydalanuvchi ID si
    const updates = req.body; // Body orqali kelgan ma'lumotlar

    try {
      // 1. Modelda mavjud bo'lmagan ustunlarni tekshirish
      const validFields = Object.keys(Users.rawAttributes); // Modelning barcha ustunlari
      const invalidFields = Object.keys(updates).filter(
        (field) => !validFields.includes(field)
      );

      if (invalidFields.length > 0) {
        return res.status(400).json({
          error: `Invalid fields in request: ${invalidFields.join(", ")}`,
        });
      }

      // 2. Userni topish
      const user = await Users.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // 3. Userni yangilash
      await user.update(updates);

      // 4. Yangilangan ma'lumotni qaytarish
      res
        .status(200)
        .json({ message: "User updated successfully", data: user });
    } catch (error) {
      res.status(500)
      .json({
        message: "Internal server error",
        error: error.message,
        status: 500,
      });
    }
  },

  async delete(req, res) {
    try {
      let { id } = req.params;
      const user = await Users.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await user.destroy();

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500)
      .json({
        message: "Internal server error",
        error: error.message,
        status: 500,
      });
    }
  },

  async download(req, res) {
    try {
      // Foydalanuvchilarni bazadan olish
      const users = await Users.findAll();

      // Excel Workbook yaratish
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Foydalanuvchilar");

      // Sarlavhalarni belgilash
      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Ism", key: "name", width: 15 },
        { header: "Familiya", key: "lastName", width: 20 },
        { header: "Lavozim", key: "position", width: 20 },
        {
          header: "Ishga qabul qilingan sana",
          key: "dateOfEmployment",
          width: 20,
        },
        { header: "Telefon raqami", key: "phoneNumber", width: 15 },
        { header: "Tug‘ilgan sana", key: "dateOfBirth", width: 15 },
        { header: "Ota-ona ismi", key: "parentName", width: 20 },
        { header: "Ish haqi turi", key: "salaryType", width: 15 },
        { header: "Izoh", key: "comment", width: 30 },
      ];

      // Foydalanuvchilar ma'lumotlarini qo'shish
      users.forEach((user) => {
        worksheet.addRow(user.toJSON());
      });

      // Excel faylni javobga yozish
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");

      // Excel faylini yozish va yuborish
      await workbook.xlsx.write(res);
      res.end(); // Bu yerda javobni tugatish
    } catch (error) {
      if (!res.headersSent) {
        res
          .status(500)
          .send("Maʼlumotlarni eksport qilishda xatolik yuz berdi.");
      }
    }
  },

  async search(req, res) {
    const { query, type } = req.query; 

    if (!query || !type) {
      return res.status(400).json({ message: 'Both query and type parameters are required' });
    }
  
    try {
      let whereClause = {};
  
      if (type === 'name') {
        whereClause = {
          name: {
            [Op.iLike]: `%${query}%`,
          },
        };
      } else if (type === 'position') {
        whereClause = {
          position: {
            [Op.iLike]: `%${query}%`,
          },
        };
      } else {
        return res.status(400).json({ message: 'Invalid search type. Use "name" or "position".' });
      }
  
      const users = await Users.findAll({
        where: whereClause,
      });
  
  
      return res.json(users);
    } catch (error) {
      res.status(500)
      .json({
        message: "Internal server error",
        error: error.message,
        status: 500,
      });
    }
  },
};
