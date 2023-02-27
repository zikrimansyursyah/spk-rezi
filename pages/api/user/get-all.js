import { API_INTERNAL_SERVER_ERROR, API_METHOD_NOT_ALLOWED, API_UNAUTHORIZED } from "@/services/constants";
import { verifyJWT } from "@/utils/jwt";

const db = require("@/database/models");
const Users = db.users;

export default async function handler(req, res) {
  if (req.method.toUpperCase() !== "POST") {
    return res.status(API_METHOD_NOT_ALLOWED.status).json(API_METHOD_NOT_ALLOWED);
  }

  if (!verifyJWT(req.headers['access_token'])) {
    return res.status(API_UNAUTHORIZED.status).json(API_UNAUTHORIZED)
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
    return res.status(API_INTERNAL_SERVER_ERROR.status).json(API_INTERNAL_SERVER_ERROR);
  }
}
