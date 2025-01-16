import jwt from "jsonwebtoken";
import { Admins } from "../../models/realations.js";
import { jwtRefreshSign, jwtSign } from "../../utils/jwt/jwt.js";
import { comparePassword, encodePassword } from "../../utils/bcrypt/bcrypt.js";

export default {
  async register(req, res) {
    try {
      let { name, lastName, password, phoneNumber } = req.body;

      password = await encodePassword(password);

      let createdAdmin = await Admins.create({
        name: name,
        lastName: lastName,
        password: password,
        phoneNumber: phoneNumber,
      });

      res.status(201).json({
        createdAdmin,
        message: "Admin created successfully",
        status: 201,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
        status: 500,
      });
    }
  },

  async login(req, res) {
    try {
      let { phoneNumber, password } = req.body;

      let data = await Admins.findOne({
        where: { phoneNumber: phoneNumber },
      });

      if (data) {
        let check_password = await comparePassword(password, data.password);
        if (check_password) {
          await data.update({ lastLogin: new Date() });

          const refreshToken = await jwtRefreshSign(data.id, data.tokenVersion);
          const accessToken = await jwtSign(data.id, data.tokenVersion);

          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 7 kun
          });

          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false, // HTTPS bo‘lmagan muhitda false
            sameSite: "lax",
            maxAge: 15 * 60 * 1000, // 15 daqiqa
          });

          return res.status(200).json({
            name: data.name,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            status: 200,
          });
        } else {
          return res.status(401).json({
            msg: "wrong phone number or password",
            status: 401,
          });
        }
      } else {
        return res.status(401).json({
          msg: "No such user exists",
          status: 401,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
        status: 500,
      });
    }
  },

  async refreshToken(req, res) {
    try {
      let { refreshToken } = req.cookies;

      if (!refreshToken) {
        return res.status(401).json({
          message: "Unauthorized",
          status: 401,
        });
      }

      let payload = jwt.verify(refreshToken, process.env.VERIFY_KEY);

      let data = await Admins.findOne({
        where: { id: payload.id },
      });

      if (!data) {
        return res.status(401).json({
          message: "Unauthorized",
          status: 401,
        });
      }

      if (data.tokenVersion !== payload.version) {
        return res.status(401).json({
          message: "Unauthorized",
          status: 401,
        });
      }

      res
        .status(200)
        .cookie("accessToken", await jwtSign(data.id, data.tokenVersion), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 15 * 60 * 1000, // 15 daqiqa
        })
        .json({ message: "Token refreshed", status: 200 });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          message: "Unauthorized",
          status: 401,
        });
      }
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
        status: 500,
      });
    }
  },

  async logout(req, res) {
    try {
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      res.status(200).json({
        message: "Logout successfully",
        status: 200,
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

  async checkAuth(req, res) {
    try {
      res
        .status(200)
        .json({ message: "You have access to this site!", status: 200 });
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
