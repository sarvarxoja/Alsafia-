export default {
  checkCreate(req, res, next) {
    try {
      let { name, totalAmount, price } = req.body;

      if (!name || !totalAmount || !price) {
        return res.status(400).json({ message: "Please fill in all fields" });
      }

      if (typeof name !== "string" || name.length < 2 || name.length > 50) {
        return res
          .status(400)
          .json({ message: "Name must be at least 2 characters" });
      }

      // if (typeof totalAmount !== "number" || totalAmount < 1) {
      //   return res
      //     .status(400)
      //     .json({ message: "Total amount must be at least 1" });
      // }

      // if (typeof price !== "number" || price < 1) {
      //   return res.status(400).json({ message: "Price must be at least 1" });
      // }

      return next();
    } catch (error) {
      console.log(error);
    }
  },

  checkSell(req, res, next) {
    try {
      let { amount, price } = req.body;

      if (!amount || !price) {
        return res.status(400).json({ message: "Please fill in all fields" });
      }

      if (amount < 1) {
        return res.status(400).json({ message: "Amount must be at least 1" });
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

  checkUpdate(req, res, next) {
    try {
      let { name, amount, cost } = req.body;

      if (!name && !amount && !cost) {
        return res.status(400).json({ message: "Please fill in all fields" });
      }

      if (
        name &&
        (typeof name !== "string" || name.length < 2 || name.length > 50)
      ) {
        return res
          .status(400)
          .json({ message: "Name must be at least 2 characters" });
      }

      if (amount && amount < 1) {
        return res.status(400).json({ message: "Amount must be at least 1" });
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
