import { RES_BAD_REQUEST, RES_INTERNAL_SERVER_ERROR, RES_METHOD_NOT_ALLOWED, RES_UNAUTHORIZE } from "@/services/constants";
import { decryptCrypto } from "@/utils/crypto";
import { verify } from "@/utils/jwt";
import { validateSchema } from "@/validation";
import { getAllSiswaSchema } from "@/validation/users";
import { Op } from "sequelize";

const db = require("@/database/models");
const Users = db.users;

export default async function handler(req, res) {
  if (req.method.toUpperCase() !== "POST") {
    return res.status(RES_METHOD_NOT_ALLOWED.status).json(RES_METHOD_NOT_ALLOWED);
  }

  const validate = await verify(decryptCrypto(req.cookies["access_token"]))
    .then((data) => data)
    .catch(() => null);

  if (validate === null) {
    return res.status(RES_UNAUTHORIZE.status).json(RES_UNAUTHORIZE);
  }

  const value = validateSchema(getAllSiswaSchema, req.body);

  // IF INVALID REQUEST
  if (value._error) {
    return res.status(RES_BAD_REQUEST.status).json({ status: RES_BAD_REQUEST.status, message: value.message });
  }

  const { first, rows, search } = value;

  try {
    const userData = await Users.findAll({
      where: { user_type: "siswa", [Op.or]: { no_induk_sekolah: { [Op.substring]: search }, nama: { [Op.substring]: search } } },
      attributes: ["id", "no_induk_sekolah", "nama", "jenis_kelamin", "nama_ayah", "nama_ibu"],
      offset: first,
      limit: rows,
      order: [
        ["updated_date", "ASC"],
        ["created_date", "ASC"],
      ],
    });

    return res.status(200).json({ status: 200, message: "Berhasil Mendapatkan Data User", data: userData });
  } catch (error) {
    return res.status(RES_INTERNAL_SERVER_ERROR.status).json(RES_INTERNAL_SERVER_ERROR);
  }
}
