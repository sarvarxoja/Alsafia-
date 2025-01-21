import axios from "axios";

export default {
  async getData(req, res) {
    try {
      let url = `${process.env.BITRIX_API_URL}/rest/${process.env.BITRIX_ID}/${process.env.BITRIX_TOKEN}`;
      const response = await axios.post(`${url}/batch`, {
        cmd: {
          users: "user.get", // Foydalanuvchilar ro'yxati
          deals: "crm.deal.list", // Kelishuvlar
          contacts: "crm.contact.list", // Kontaktlar
          companies: "crm.company.list", // Kompaniyalar
          tasks: "task.item.list", // Vazifalar
        },
      });

      console.log(url);
      console.log(response);
      //   let data = JSON.parse(response.data);
      res.status(200).send(response.data);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
        status: 500,
      });
    }
  },
};
