import axios from "axios";

export default {
  async getData(req, res) {
    try {
      const response = await axios.get(
        `${process.env.BITRIX_API_URL}?auth=${process.env.BITRIX_TOKEN}`
      );

      //   console.log(response.data);
      //   let data = JSON.parse(response.data);
      res.status(200).send(response.data);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
        status: 500,
      });
    }
  },
};
