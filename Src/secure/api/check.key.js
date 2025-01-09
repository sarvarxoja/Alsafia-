export default {
  checkApiKey(req, res, next) {
    try {
      const clientApiKey = req.headers["x-api-key"];

      if (!clientApiKey || clientApiKey !== `Bearer ${process.env.API_KEY}`) {
        return res
          .status(403)
          .json({ message: "Invalid or missing API key", status: 403 });
      }

      next();
    } catch (error) {
      console.log(error);
    }
  },
};
