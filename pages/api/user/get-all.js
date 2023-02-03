const db = require("@/database/models");
const Users = db.users;

export default async function handler(req, res) {
  if (req.method.toUpperCase() !== "POST") {
    return res.status(400).json({
      status: 403,
      message: "Request Method Not Allowed",
    });
  }

  const { first = 0, rows = 10 } = req.body;

  try {
    const userData = await Users.findAll({
      attributes: {
        exclude: ["created_date", "created_by", "updated_date", "updated_by"],
      },
      offset: first,
      limit: rows,
    });

    return res.status(200).json({ status: 200, message: "Berhasil Mendapatkan Data User", data: userData });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
}
