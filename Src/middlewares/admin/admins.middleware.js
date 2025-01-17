import { Admins } from "../../models/realations.js";

export default {
  async checkAdminUpdate(req, res, next) {
    try {
      let { name, lastName, password, phoneNumber, role } = req.body;

      if (!name && !lastName && !password && !phoneNumber && !role) {
        return res.status(400).json({ message: "Please fill in all fields" });
      }

      if (password) {
        if (
          typeof password !== "string" ||
          password.length < 8 ||
          password.length > 20
        ) {
          return res
            .status(400)
            .json({ message: "Password must be at least 8" });
        }
      }

      if (phoneNumber) {
        if (typeof phoneNumber !== "string") {
          return res.status(400).json({
            message: "Invalide phone number. Phone number must be string",
          });
        }
      }

      if (name) {
        let nameRegex = /^[a-zA-Z]+$/;

        if (
          typeof name !== "string" ||
          name.length < 4 ||
          name.length > 50 ||
          !nameRegex.test(name)
        ) {
          return res
            .status(400)
            .json({ message: "Name must be at least 2 characters" });
        }
      }

      if (lastName) {
        if (
          typeof lastName !== "string" ||
          lastName.length < 4 ||
          lastName.length > 60
        ) {
          return res
            .status(400)
            .json({ message: "Last name must be at least 2 characters" });
        }
      }

      if (phoneNumber) {
        let phoneNumberCheck = await Admins.findOne({
          where: { phoneNumber: phoneNumber },
        });

        if (phoneNumberCheck) {
          return res
            .status(400)
            .json({ message: "Phone number already exists" });
        }
      }

      if (role) {
        if (role === "hr" && role === "pm") {
          return res
            .status(400)
            .json({ message: "role must be hr or pm", status: 400 });
        }
      }

      return next();
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
        status: 500,
      });
    }
  },
};
