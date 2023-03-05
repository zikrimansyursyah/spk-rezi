import { sequelize } from "@/database/models";
import { RES_INTERNAL_SERVER_ERROR, RES_METHOD_NOT_ALLOWED, RES_UNAUTHORIZE } from "@/services/constants";
import { decryptCrypto } from "@/utils/crypto";
import { verify } from "@/utils/jwt";
import { QueryTypes } from "sequelize";

export default async function handler(req, res) {
  if (req.method.toUpperCase() !== "GET") {
    return res.status(RES_METHOD_NOT_ALLOWED.status).json(RES_METHOD_NOT_ALLOWED);
  }

  const validate = await verify(decryptCrypto(req.cookies["access_token"]))
    .then((data) => data)
    .catch(() => null);

  if (validate === null) {
    return res.status(RES_UNAUTHORIZE.status).json(RES_UNAUTHORIZE);
  }

  try {
    const tipePengguna = await sequelize.query(`SELECT DISTINCT user_type FROM users u`, { type: QueryTypes.SELECT });

    return res.status(200).json({ status: 200, message: "Berhasil Mendapatkan Data Tipe User", data: tipePengguna });
  } catch (error) {
    return res.status(RES_INTERNAL_SERVER_ERROR.status).json(RES_INTERNAL_SERVER_ERROR);
  }
}
