import { RES_BAD_REQUEST, RES_INTERNAL_SERVER_ERROR, RES_METHOD_NOT_ALLOWED } from "@/services/constants";
import { decryptCrypto, encryptCrypto } from "@/utils/crypto";
import { sign } from "@/utils/jwt";
import { validateSchema } from "@/validation";
import { loginSchema } from "@/validation/auth";
import * as menuUser from "@/services/menu";
import { setCookie } from "cookies-next";

const db = require("@/database/models");
const Users = db.users;

export default async function handler(req, res) {
  if (req.method.toUpperCase() !== "POST") {
    return res.status(RES_METHOD_NOT_ALLOWED.status).json(RES_METHOD_NOT_ALLOWED);
  }

  const value = validateSchema(loginSchema, req.body);

  // IF INVALID REQUEST
  if (value._error) {
    return res.status(RES_BAD_REQUEST.status).json({ status: RES_BAD_REQUEST.status, message: value.message });
  }

  const { username, password, is_remember } = value;

  try {
    const attributes = ["id", "user_type", "nisn", "no_induk_sekolah", "nama", "username", "password"];

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
      return res.status(401).json({ status: 401, message: "Username / NIS tidak ditemukan" });
    }

    const decryptPassword = decryptCrypto(user.password);
    if (decryptPassword !== password) {
      return res.status(401).json({ status: 401, message: "Password Tidak Sesuai" });
    }

    delete user.password;

    const token = await sign(user, is_remember);
    const encryptToken = encryptCrypto(token);
    const maxAge = Math.floor(Date.now() / 1000) + 120 * (is_remember ? 420 : 60);

    const menu = {
      ADMIN: menuUser.ADMIN,
      SISWA: menuUser.SISWA,
    };
    const encryptMenu = encryptCrypto(JSON.stringify(menu[user.user_type.toUpperCase()]));

    // SET COOKIES
    setCookie("access_token", encryptToken, { req, res, httpOnly: true, maxAge, secure: true });
    setCookie("menu", encryptMenu, { req, res, httpOnly: true, maxAge, secure: true });

    return res.status(200).json({ status: 200, message: "Login Berhasil", token: encryptToken, menu: encryptMenu, maxAge });
  } catch (error) {
    return res.status(RES_INTERNAL_SERVER_ERROR.status).json(RES_INTERNAL_SERVER_ERROR);
  }
}
