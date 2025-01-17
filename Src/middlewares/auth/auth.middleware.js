import { Admins } from "../../models/realations.js";

export default {
  async checkRegister(req, res, next) {
    try {
      let { name, lastName, password, phoneNumber, role } = req.body;

      if (!name || !lastName || !password || !phoneNumber || !role) {
        return res.status(400).json({ message: "Please fill in all fields" });
      }

      if (
        typeof password !== "string" ||
        password.length < 8 ||
        password.length > 20
      ) {
        return res.status(400).json({ message: "Password must be at least 8" });
      }

      if ( typeof phoneNumber !== "string") {
        return res.status(400).json({ message: "Invalide phone number. Phone number must be string" });
      }

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

      if (
        typeof lastName !== "string" ||
        lastName.length < 4 ||
        lastName.length > 60
      ) {
        return res
          .status(400)
          .json({ message: "Last name must be at least 2 characters" });
      }

      let phoneNumberCheck = await Admins.findOne({
        where: { phoneNumber: phoneNumber },
      });

      if (phoneNumberCheck) {
        return res.status(400).json({ message: "Phone number already exists" });
      }

      if (role === "hr" && role === "pm") {
        return res
          .status(400)
          .json({ message: "role must be hr or pm", status: 400 });
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

  checkLogin(req, res, next) {
    try {
      let { phoneNumber, password } = req.body;

      if (!phoneNumber || !password) {
        return res.status(400).json({ message: "Please fill in all fields" });
      }

      if (typeof phoneNumber !== "string") {
        return res
          .status(400)
          .json({ message: "Phone number must be at least 10 characters" });
      }

      if (typeof password !== "string") {
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters" });
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
