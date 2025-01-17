import moment from "moment-timezone";
import { Users } from "../../models/realations.js";

export default {
  async checkCreate(req, res, next) {
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

      if (
        !name ||
        !lastName ||
        !position ||
        !dateOfEmployment ||
        !phoneNumber ||
        !dateOfBirth ||
        !parentName ||
        !salaryType ||
        !comment
      ) {
        return res.status(400).json({ message: "All fields are required!!" });
      }

      if (typeof name !== "string" || name.length < 3 || name.length > 50) {
        return res
          .status(400)
          .json({ message: "Name must be at least 3 characters" });
      }

      if (
        typeof lastName !== "string" ||
        lastName.length < 3 ||
        lastName.length > 60
      ) {
        return res
          .status(400)
          .json({ message: "Last name must be at least 3 characters" });
      }

      if (
        typeof position !== "string" ||
        position.length < 3 ||
        position.length > 100
      ) {
        return res
          .status(400)
          .json({ message: "Position must be at least 3 characters" });
      }

      if (
        typeof phoneNumber !== "string" ||
        phoneNumber.length < 10 ||
        phoneNumber.length > 15
      ) {
        return res
          .status(400)
          .json({ message: "Phone number must be at least 10 characters" });
      }

      let phoneNumberCheck = await Users.findOne({
        where: { phoneNumber: phoneNumber },
      });

      if (phoneNumberCheck) {
        return res.status(400).json({ message: "Phone number already exists" });
      }

      if (!moment(dateOfEmployment, "YYYY-MM-DD", true).isValid()) {
        return res.status(400).send({
          message: "Invalid dateOfEmployment format. Use YYYY-MM-DD.",
        });
      }

      if (!moment(dateOfBirth, "YYYY-MM-DD", true).isValid()) {
        return res
          .status(400)
          .send({ message: "Invalid dateOfBirth format. Use YYYY-MM-DD." });
      }

      if (
        typeof parentName !== "string" ||
        parentName.length < 3 ||
        parentName.length > 100
      ) {
        return res
          .status(400)
          .json({ message: "Parent name must be at least 3 characters" });
      }

      if (
        typeof salaryType !== "string" ||
        (salaryType !== "stable" && salaryType !== "percentage")
      ) {
        return res
          .status(400)
          .json({ message: "Salary type must be stable or percentage" });
      }

      if (
        typeof comment !== "string" ||
        comment.length < 3 ||
        comment.length > 500
      ) {
        return res
          .status(400)
          .json({ message: "Comment must be at least 3 characters" });
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

  async checkUpdate(req, res, next) {
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

      if (
        !name &&
        !lastName &&
        !position &&
        !dateOfEmployment &&
        !phoneNumber &&
        !dateOfBirth &&
        !parentName &&
        !salaryType &&
        !comment
      ) {
        return res
          .status(400)
          .json({ message: "At least one field must be filled" });
      }

      if (name) {
        if (typeof name !== "string" || name.length < 3 || name.length > 50) {
          return res
            .status(400)
            .json({ message: "Name must be at least 3 characters" });
        }
      }

      if (lastName) {
        if (
          typeof lastName !== "string" ||
          lastName.length < 3 ||
          lastName.length > 60
        ) {
          return res
            .status(400)
            .json({ message: "Last name must be at least 3 characters" });
        }
      }

      if (position) {
        if (
          typeof position !== "string" ||
          position.length < 3 ||
          position.length > 100
        ) {
          return res
            .status(400)
            .json({ message: "Position must be at least 3 characters" });
        }
      }

      if (phoneNumber) {
        if (
          typeof phoneNumber !== "string" ||
          phoneNumber.length < 10 ||
          phoneNumber.length > 15
        ) {
          return res
            .status(400)
            .json({ message: "Phone number must be at least 10 characters" });
        }
      }

      if (dateOfEmployment) {
        if (!moment(dateOfEmployment, "YYYY-MM-DD", true).isValid()) {
          return res.status(400).send({
            message: "Invalid dateOfEmployment format. Use YYYY-MM-DD.",
          });
        }
      }

      if (dateOfBirth) {
        if (dateOfBirth && !moment(dateOfBirth, "YYYY-MM-DD", true).isValid()) {
          return res
            .status(400)
            .send({ message: "Invalid dateOfBirth format. Use YYYY-MM-DD." });
        }
      }

      if (parentName) {
        if (
          typeof parentName !== "string" ||
          parentName.length < 3 ||
          parentName.length > 100
        ) {
          return res
            .status(400)
            .json({ message: "Parent name must be at least 3 characters" });
        }
      }

      if (salaryType) {
        if (
          typeof salaryType !== "string" ||
          (salaryType !== "stable" && salaryType !== "percentage")
        ) {
          return res
            .status(400)
            .json({ message: "Salary type must be stable or percentage" });
        }
      }

      if (comment) {
        if (
          typeof comment !== "string" ||
          comment.length < 3 ||
          comment.length > 500
        ) {
          return res
            .status(400)
            .json({ message: "Comment must be at least 3 characters" });
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
