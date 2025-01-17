import jwt from "jsonwebtoken";
import { Admins } from "../../models/realations.js";

export default {
  async checkAdminToken(req, res, next) {
    try {
      let { accessToken } = req.cookies;

      if (!accessToken) {
        return res
          .status(401)
          .json({ message: "Access token not found", status: 401 });
      }

      let payload = jwt.verify(accessToken, process.env.SECRET_KEY);

      let data = await Admins.findOne({
        where: { id: payload.id },
      });

      if (!data) {
        return res.status(401).json({ message: "Unauthorized", status: 401 });
      }

      if (data.tokenVersion !== payload.version) {
        return res.status(401).json({ message: "Unauthorized", status: 401 });
      }

      if (data.supperAdmin !== true) {
        return res.status(401).json({ message: "Unauthorized", status: 401 });
      }

      req.admin = data;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: "Unauthorized", status: 401 });
      }
    }
  },

  async checkHrToken(req, res, next) {
    try {
      let { accessToken } = req.cookies;

      if (!accessToken) {
        return res
          .status(401)
          .json({ message: "Access token not found", status: 401 });
      }

      let payload = jwt.verify(accessToken, process.env.SECRET_KEY);

      let data = await Admins.findOne({
        where: { id: payload.id },
      });

      if (!data) {
        return res.status(401).json({ message: "Unauthorized", status: 401 });
      }

      if (data.tokenVersion !== payload.version) {
        return res.status(401).json({ message: "Unauthorized", status: 401 });
      }
      // Super admin yoki HR rolini tekshirish
      if (data.supperAdmin === true || data.role === "hr") {
        req.admin = data;
        return next();
      }

      return res.status(401).json({ message: "Unauthorized", status: 401 });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: "Unauthorized", status: 401 });
      }

      console.error("Error in checkAdminToken:", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", status: 500 });
    }
  },

  async checkPmToken(req, res, next) {
    try {
      let { accessToken } = req.cookies;

      if (!accessToken) {
        return res
          .status(401)
          .json({ message: "Access token not found", status: 401 });
      }

      let payload = jwt.verify(accessToken, process.env.SECRET_KEY);

      let data = await Admins.findOne({
        where: { id: payload.id },
      });

      if (!data) {
        return res.status(401).json({ message: "Unauthorized", status: 401 });
      }

      if (data.tokenVersion !== payload.version) {
        return res.status(401).json({ message: "Unauthorized", status: 401 });
      }
      if (data.supperAdmin === true || data.role === "pm") {
        req.admin = data;
        return next();
      }

      return res.status(401).json({ message: "Unauthorized", status: 401 });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: "Unauthorized", status: 401 });
      }

      console.error("Error in checkAdminToken:", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", status: 500 });
    }
  },

  async checkUserToken(req, res, next) {
    try {
      let { accessToken } = req.cookies;

      if (!accessToken) {
        return res
          .status(401)
          .json({ message: "Access token not found", status: 401 });
      }

      let payload = jwt.verify(accessToken, process.env.SECRET_KEY);

      let data = await Admins.findOne({
        where: { id: payload.id },
      });

      if (!data) {
        return res.status(401).json({ message: "Unauthorized", status: 401 });
      }

      if (data.tokenVersion !== payload.version) {
        return res.status(401).json({ message: "Unauthorized", status: 401 });
      }

      req.admin = data;
      return next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: "Unauthorized", status: 401 });
      }

      console.error("Error in checkAdminToken:", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", status: 500 });
    }
  },
};
