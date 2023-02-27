import { authValidation } from "@/validation";
import { signJWT } from "@/utils/jwt";
import { decryptCrypto } from "@/utils/crypto";
import { API_INTERNAL_SERVER_ERROR, API_METHOD_NOT_ALLOWED } from "@/services/constants";

const db = require("@/database/models");
const Users = db.users;

export default async function login(req, res) {
  if (req.method.toUpperCase() !== "POST") {
    return res.status(API_METHOD_NOT_ALLOWED.status).json(API_METHOD_NOT_ALLOWED);
  }

  const { value, error } = authValidation.loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  }

  const { username, password, is_remember } = value;
  try {
    const attributes = {
      exclude: ["created_date", "created_by", "updated_date", "updated_by", "nik", "nisn", "tempat_lahir", "tanggal_lahir", "jenis_kelamin", "alamat", "no_telp"],
      include: [
        [
          db.sequelize.literal(`(
            SELECT a.name
            FROM enumeration a
            WHERE a.id = users.user_type
          )`),
          "user_type_name",
        ],
        [
          db.sequelize.literal(`(
            SELECT a.nama_kelas
            FROM kelas a
            WHERE a.id = users.id_kelas
          )`),
          "nama_kelas",
        ],
      ],
    };

    let user = await Users.findOne({
      where: { username },
      attributes,
      raw: true,
    });
    if (!user) {
      user = await Users.findOne({
        where: { no_induk_sekolah: username },
        attributes,
        raw: true,
      });
    }

    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "Username tidak ditemukan",
      });
    }

    const decryptPassword = decryptCrypto(user.password);
    if (decryptPassword !== password) {
      return res.status(401).json({
        status: 401,
        message: "Password tidak sesuai",
      });
    }

    const userData = { ...user };
    delete userData.password;

    const token = signJWT(userData, is_remember ? "168h" : "12h");

    return res.status(200).json({ status: 200, message: "Login Berhasil", data: { token, role: userData.user_type_name } });
  } catch (error) {
    return res.status(API_INTERNAL_SERVER_ERROR.status).json(API_INTERNAL_SERVER_ERROR);
  }
}
