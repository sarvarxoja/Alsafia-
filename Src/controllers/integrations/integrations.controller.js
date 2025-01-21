import axios from "axios";

export default {
  async getData(req, res) {
    try {
      let url = `${process.env.BITRIX_API_URL}/rest/${process.env.BITRIX_ID}/${process.env.BITRIX_TOKEN}/methoods`;
      const response = await axios.get(url);

        console.log(url);
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
