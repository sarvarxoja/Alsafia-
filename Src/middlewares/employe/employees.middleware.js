import { Admins } from "../../models/realations.js";

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

      let contentRegex = /^[a-zA-Z]+$/;

      if (
        typeof name !== "string" ||
        name.length < 3 ||
        name.length > 50 ||
        !contentRegex.test(name)
      ) {
        return res
          .status(400)
          .json({ message: "Name must be at least 3 characters" });
      }

      if (
        typeof lastName !== "string" ||
        lastName.length < 3 ||
        lastName.length > 60 ||
        !contentRegex.test(lastName)
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

      let phoneNumberRegex = /^[0-9]+$" "/;

      if (
        typeof phoneNumber !== "string" ||
        phoneNumber.length < 10 ||
        phoneNumber.length > 15 ||
        !phoneNumberRegex.test(phoneNumber)
      ) {
        return res
          .status(400)
          .json({ message: "Phone number must be at least 10 characters" });
      }

      let phoneNumberCheck = await Admins.findOne({
        where: { phoneNumber: phoneNumber },
      });

      if (phoneNumberCheck) {
        return res.status(400).json({ message: "Phone number already exists" });
      }

      if (
        typeof dateOfEmployment !== "string" ||
        dateOfEmployment.length < 10
      ) {
        return res.status(400).json({
          message: "Date of employment must be at least 10 characters",
        });
      }

      if (typeof dateOfBirth !== "string" || dateOfBirth.length < 10) {
        return res
          .status(400)
          .json({ message: "Date of birth must be at least 10 characters" });
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
        salaryType !== "stable" ||
        salaryType !== "percentage"
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
      console.log(error);
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
        let contentRegex = /^[a-zA-Z]+$/;

        if (
          typeof name !== "string" ||
          name.length < 3 ||
          name.length > 50 ||
          !contentRegex.test(name)
        ) {
          return res
            .status(400)
            .json({ message: "Name must be at least 3 characters" });
        }
      }

      if (lastName) {
        let contentRegex = /^[a-zA-Z]+$/;

        if (
          typeof lastName !== "string" ||
          lastName.length < 3 ||
          lastName.length > 60 ||
          !contentRegex.test(lastName)
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
        let phoneNumberRegex = /^[0-9]+$" "/;

        if (
          typeof phoneNumber !== "string" ||
          phoneNumber.length < 10 ||
          phoneNumber.length > 15 ||
          !phoneNumberRegex.test(phoneNumber)
        ) {
          return res
            .status(400)
            .json({ message: "Phone number must be at least 10 characters" });
        }
      }

      if (dateOfEmployment) {
        if (
          typeof dateOfEmployment !== "string" ||
          dateOfEmployment.length < 10
        ) {
          return res.status(400).json({
            message: "Date of employment must be at least 10 characters",
          });
        }
      }

      if (dateOfBirth) {
        if (typeof dateOfBirth !== "string" || dateOfBirth.length < 10) {
          return res
            .status(400)
            .json({ message: "Date of birth must be at least 10 characters" });
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
          salaryType !== "stable" ||
          salaryType !== "percentage"
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
      console.log(error);
    }
  },
};
