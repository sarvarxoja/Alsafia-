import axios from "axios";
import cron from "node-cron";
import { Op } from "sequelize";
import {
  ContactStatModel,
  Users,
  DealsStatModel,
} from "../../models/realations.js";

async function copyData(req, res) {
  try {
    console.log("success");
    let url = `${process.env.BITRIX_API_URL}/rest/${process.env.BITRIX_ID}/${process.env.BITRIX_TOKEN}`;

    const response = await axios.post(
      `${url}/batch.json`,
      {
        cmd: {
          getUsers: "user.get",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const usersData = response.data.result.result.getUsers;

    for (const user of usersData) {
      await Users.findOrCreate({
        where: { system_id: user.ID },
        defaults: {
          system_id: user.ID,
          name: `${user.NAME || "unknown"}`,
          lastName: `${user.LAST_NAME || "unknown"}`,
          email: user.email,
          position: "operator",
          registered: user.DATE_REGISTER,
          phoneNumber: `${user.PERSONAL_MOBILE || "unknown"}`,
          dateOfBirth: user.PERSONAL_BIRTHDAY,
          parentName: `${user.SECOND_NAME || "unknown"}`,
          salaryType: `unknown`,
          isOnline: `${user.IS_ONLINE || "u"}`,
          lastLogin: `${user.LAST_LOGIN}`,
          dateOfEmployment: user.UF_EMPLOYMENT_DATE,
        },
      });
    }

    return { msg: "Data successfully copied", status: 201 };
  } catch (error) {
    console.log(error);
  }
}

async function getContactsWorkStats(id) {
  try {
    if (!id) {
      return { message: "bad request", status: 400 };
    }

    const url = `${process.env.BITRIX_API_URL}/rest/${process.env.BITRIX_ID}/${process.env.BITRIX_TOKEN}`;
    let start = 0;
    let allContacts = [];

    do {
      const response = await axios.post(
        `${url}/batch.json`,
        {
          cmd: {
            getContacts: `crm.contact.list?filter[ASSIGNED_BY_ID]=${id}&select[]=ID&select[]=LAST_ACTIVITY_TIME&select[]=DATE_CREATE&start=${start}`,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const currentContacts = response.data.result.result.getContacts;
      allContacts = [...allContacts, ...currentContacts];
      start = response.data.result.result_next.getContacts || null;
    } while (start !== null);

    // Endi statistikani hisoblash
    let connected = 0;
    let notConnected = 0;

    allContacts.forEach((contact) => {
      if (contact.DATE_CREATE !== contact.LAST_ACTIVITY_TIME) {
        connected++;
      } else {
        notConnected++;
      }
    });

    const total = allContacts.length;
    const connectedPercentage = ((connected / total) * 100).toFixed(2);
    const notConnectedPercentage = ((notConnected / total) * 100).toFixed(2);

    if (total === 0) {
      return {
        totalContacts: 0,
        connected: 0,
        notConnected: 0,
        connectedPercentage: "0%",
        notConnectedPercentage: "0%",
      };
    }

    await ContactStatModel.create({
      system_id: id,
      totalContacts: total,
      connected: connected,
      notConnected: notConnected,
      connectedPercentage: `${connectedPercentage}%`,
      notConnectedPercentage: `${notConnectedPercentage}%`,
    });

    return {
      totalContacts: total,
      connected,
      notConnected,
      connectedPercentage: `${connectedPercentage}%`,
      notConnectedPercentage: `${notConnectedPercentage}%`,
    };
  } catch (error) {
    console.error(error);
    return { error: "Server error" };
  }
}

async function getDealsWorkStats(id) {
  try {
    if (!id) {
      return { message: "bad request", status: 400 };
    }

    const url = `${process.env.BITRIX_API_URL}/rest/${process.env.BITRIX_ID}/${process.env.BITRIX_TOKEN}`;

    let start = 0;
    let allDeals = [];

    do {
      const response = await axios.post(
        `${url}/batch.json`,
        {
          cmd: {
            getDeals: `crm.deal.list?filter[ASSIGNED_BY_ID]=${id}&select[]=ID&select[]=TITLE&select[]=CURRENCY_ID&select[]=OPPORTUNITY&select[]=DATE_CREATE&start=${start}`,
          },
        },

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const currentDeals = response.data.result.result.getDeals;
      allDeals = [...allDeals, ...currentDeals];
      start = response.data.result.result_next.getDeals || null;
    } while (start !== null);

    let totalSales = 0;
    allDeals.forEach((deal) => {
      totalSales += parseFloat(deal.OPPORTUNITY || 0); // `OPPORTUNITY` qiymatini qo'shish
    });

    const tenMillion = 10000000;
    const percentage = ((totalSales / tenMillion) * 100).toFixed(2);

    if (allDeals.length === 0) {
      return {
        totalDeals: 0,
        totalSales: `0 UZS`,
        percentage: `0%`,
        status: 200,
      };
    }

    await DealsStatModel.create({
      system_id: id,
      totalDeals: allDeals.length,
      totalSales: `${totalSales.toLocaleString("uz-UZ")} UZS`,
      percentage: `${percentage}%`,
    });

    return {
      totalDeals: allDeals.length,
      totalSales: `${totalSales.toLocaleString("uz-UZ")} UZS`, // Jami sotuv summasi
      percentage: `${percentage}%`, // 10 mln so'mga nisbatan ulushi
      status: 200,
    };
  } catch (error) {
    console.error(error);
    return { error: "Serverda xatolik yuz berdi" };
  }
}

cron.schedule("58 7 * * *", copyData);
cron.schedule("58 12 * * *", copyData);
cron.schedule("58 17 * * *", copyData);

cron.schedule("20 7,12,18 * * *", async () => {
  console.log(
    "Statistikani yangilash jarayoni boshlandi:",
    new Date().toLocaleTimeString()
  );

  try {
    // `system_id` qiymati `null` bo‘lmagan barcha foydalanuvchilarni olish
    const users = await Users.findAll({
      where: {
        system_id: {
          [Op.ne]: null, // `null` bo'lmaganlarni tanlash
        },
      },
    });

    // Har bir foydalanuvchi uchun funksiyani chaqirish
    for (const user of users) {
      const { system_id } = user;
      console.log(`Statistika to'planyapti: User ID - ${system_id}`);
      await getContactsWorkStats(system_id);
    }

    console.log("Statistikani yangilash jarayoni tugadi.");
  } catch (error) {
    console.error("Statistikani yangilashda xatolik yuz berdi:", error);
  }
});

cron.schedule("20 7,11,18 * * *", async () => {
  console.log(
    "Sotuvlar statistikasi yangilash boshlandi:",
    new Date().toLocaleTimeString()
  );

  try {
    // `system_id` qiymati `null` bo‘lmagan foydalanuvchilarni olish
    const users = await Users.findAll({
      where: {
        system_id: {
          [Op.ne]: null, // `null` bo'lmaganlarni tanlash
        },
      },
    });

    // Har bir foydalanuvchi uchun funksiyani chaqirish
    for (const user of users) {
      const { system_id } = user;
      console.log(`Statistika to'planyapti: User ID - ${system_id}`);
      await getDealsWorkStats(system_id);
    }

    console.log("Sotuvlar statistikasi yangilash jarayoni tugadi.");
  } catch (error) {
    console.error(
      "Sotuvlar statistikasi yangilashda xatolik yuz berdi:",
      error
    );
  }
});

export default {
  async getData(req, res) {
    try {
      let url = `${process.env.BITRIX_API_URL}/rest/${process.env.BITRIX_ID}/${process.env.BITRIX_TOKEN}`;
      const response = await axios.post(
        `${url}/batch.json`,
        {
          cmd: {
            getUsers: "user.get",
            getDeals: "crm.deal.list",
            getContacts: "crm.contact.list",
            getActivites: "crm.activity.list",
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      res.status(201).send({ data: response.data, status: 201 });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
        status: 500,
      });
    }
  },

  async contactStats(req, res) {
    const { date } = req.query; // Querydan sanani oling
    const { id, data } = req.params; // Paramsdan ID va data turingizni oling

    try {
      let results = null;

      // Sana oralig'ini hisoblang
      const startOfDay = new Date(date + " 00:00:00");
      const endOfDay = new Date(date + " 23:59:59");

      // Shart bo‘yicha qidirish
      if (data === "contact") {
        results = await ContactStatModel.findAll({
          where: {
            system_id: id,
            createdAt: {
              [Op.between]: [startOfDay, endOfDay],
            },
          },
        });
      } else {
        results = await DealsStatModel.findAll({
          where: {
            system_id: id,
            createdAt: {
              [Op.between]: [startOfDay, endOfDay],
            },
          },
        });
      }

      // Ma'lumot mavjud emasligini tekshirish
      if (results.length === 0) {
        return res.status(404).json({ message: "Data not found", status: 404 });
      }

      // Natijani qaytarish
      res.status(200).json({ results, status: 200 });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
        status: 500,
      });
    }
  },
};
