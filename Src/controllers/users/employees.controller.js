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
      console.log(error);
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
      console.error(error);
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
      console.log(error);
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
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
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
      console.log(error);
    }
  },
};
