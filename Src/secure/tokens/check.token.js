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

      req.admin = data;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: "Unauthorized", status: 401 });
      }
    }
  },
};
