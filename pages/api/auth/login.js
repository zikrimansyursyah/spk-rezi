import { authValidation } from "@/validation";
import CryptoJS from "crypto-js";
import db from "@/database/models";
import jwt from "jsonwebtoken";

require("dotenv").config();
const Users = db.users;

export default async function handler(req, res) {
  if (req.method.toUpperCase() !== "POST") {
    return res.status(400).json({
      status: 403,
      message: "Request Method Not Allowed",
    });
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
      return res.status(403).json({
        status: 403,
        message: "Username tidak ditemukan",
      });
    }

    const decryptPassword = CryptoJS.AES.decrypt(user.password, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8);
    if (decryptPassword !== password) {
      return res.status(403).json({
        status: 403,
        message: "Password tidak sesuai",
      });
    }

    const userData = { ...user };
    delete userData.password;

    const token = jwt.sign(userData, process.env.JWT_SECRET_KEY, { expiresIn: is_remember ? "168h" : "12h" });

    return res.status(200).json({ status: 200, message: "Login Berhasil", data: { token } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
}
