import { RES_BAD_REQUEST, RES_INTERNAL_SERVER_ERROR, RES_METHOD_NOT_ALLOWED, RES_UNAUTHORIZE } from "@/services/constants";
import { decryptCrypto, encryptCrypto } from "@/utils/crypto";
import { verify } from "@/utils/jwt";
import { validateSchema } from "@/validation";
import { userSchema } from "@/validation/auth";
import { getAllSiswaSchema } from "@/validation/users";
import { Op } from "sequelize";

const db = require("@/database/models");
const Users = db.users;

async function getAll(req, res) {
  if (req.method.toUpperCase() !== "POST") {
    return res.status(RES_METHOD_NOT_ALLOWED.status).json(RES_METHOD_NOT_ALLOWED);
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

async function getName(req, res) {
  if (req.method.toUpperCase() !== "POST") {
    return res.status(RES_METHOD_NOT_ALLOWED.status).json(RES_METHOD_NOT_ALLOWED);
  }

  const { id } = req.body;

  try {
    const userName = await Users.findByPk(id, { attributes: ["nama"] });

    if (userName === null) {
      return res.status(404).json({ status: 404, message: "User Not Found" });
    }

    return res.status(200).json({ status: 200, message: "Berhasil Mendapatkan Nama User", data: userName });
  } catch (error) {
    return res.status(RES_INTERNAL_SERVER_ERROR.status).json(RES_INTERNAL_SERVER_ERROR);
  }
}

async function getDetailSiswa(req, res) {
  if (req.method.toUpperCase() !== "POST") {
    return res.status(RES_METHOD_NOT_ALLOWED.status).json(RES_METHOD_NOT_ALLOWED);
  }

  const { id } = req.body;

  try {
    const user = await Users.findByPk(id, { attributes: { exclude: ["created_by", "updated_by"] }, raw: true });

    if (user === null) {
      return res.status(404).json({ status: 404, message: "User Not Found" });
    }

    const password = decryptCrypto(user.password);
    delete user.password;

    return res.status(200).json({ status: 200, message: "Berhasil Mendapatkan Nama User", data: { ...user, password } });
  } catch (error) {
    return res.status(RES_INTERNAL_SERVER_ERROR.status).json(RES_INTERNAL_SERVER_ERROR);
  }
}

async function editSiswa(req, res) {
  if (req.method.toUpperCase() !== "PUT") {
    return res.status(RES_METHOD_NOT_ALLOWED.status).json(RES_METHOD_NOT_ALLOWED);
  }

  const value = validateSchema(userSchema, req.body);

  // IF INVALID REQUEST
  if (value._error) {
    return res.status(RES_BAD_REQUEST.status).json({ status: RES_BAD_REQUEST.status, message: value.message });
  }

  try {
    const data = {
      ...value,
      password: encryptCrypto(value.password),
      updated_date: new Date(),
      updated_by: req.validate.id,
    };
    delete data.id;

    await Users.update(data, { where: { id: value.id } });

    return res.status(200).json({ status: 200, message: "Berhasil Merubah User" });
  } catch (error) {
    return res.status(RES_INTERNAL_SERVER_ERROR.status).json(RES_INTERNAL_SERVER_ERROR);
  }
}

async function addSiswa(req, res) {
  if (req.method.toUpperCase() !== "POST") {
    return res.status(RES_METHOD_NOT_ALLOWED.status).json(RES_METHOD_NOT_ALLOWED);
  }

  const value = validateSchema(userSchema, req.body);

  // IF INVALID REQUEST
  if (value._error) {
    return res.status(RES_BAD_REQUEST.status).json({ status: RES_BAD_REQUEST.status, message: value.message });
  }

  try {
    const userNIS = await Users.findOne({
      where: {
        no_induk_sekolah: value.no_induk_sekolah,
      },
    });
    if (userNIS) {
      return res.status(404).json({ status: 404, message: "Nomor Induk Sekolah sudah digunakan" });
    }

    const userNISN = await Users.findOne({
      where: {
        nisn: value.nisn,
      },
    });
    if (userNISN) {
      return res.status(404).json({ status: 404, message: "NISN sudah digunakan" });
    }

    const userUsername = await Users.findOne({
      where: {
        username: value.username,
      },
    });
    if (userUsername) {
      return res.status(404).json({ status: 404, message: "Username sudah digunakan" });
    }

    const data = {
      ...value,
      user_type: "siswa",
      password: encryptCrypto(value.password),
      created_date: new Date(),
      created_by: req.validate.id,
      updated_date: new Date(),
      updated_by: req.validate.id,
    };

    await Users.create(data);

    return res.status(200).json({ status: 200, message: "Berhasil Menambah User" });
  } catch (error) {
    console.error(error);
    return res.status(RES_INTERNAL_SERVER_ERROR.status).json(RES_INTERNAL_SERVER_ERROR);
  }
}

async function deleteSiswa(req, res) {
  if (req.method.toUpperCase() !== "DELETE") {
    return res.status(RES_METHOD_NOT_ALLOWED.status).json(RES_METHOD_NOT_ALLOWED);
  }

  const { id } = req.body;

  try {
    await Users.destroy({ where: { id: id } });

    return res.status(200).json({ status: 200, message: "Berhasil Merubah User" });
  } catch (error) {
    return res.status(RES_INTERNAL_SERVER_ERROR.status).json(RES_INTERNAL_SERVER_ERROR);
  }
}

async function getDropdownSiswa(req, res) {
  if (req.method.toUpperCase() !== "GET") {
    return res.status(RES_METHOD_NOT_ALLOWED.status).json(RES_METHOD_NOT_ALLOWED);
  }

  try {
    const userData = await Users.findAll({
      where: {
        user_type: "siswa",
      },
      attributes: ["id", "nama"],
      order: [["nama", "ASC"]],
    });

    return res.status(200).json({ status: 200, message: "Berhasil Mendapatkan User", data: userData });
  } catch (error) {
    return res.status(RES_INTERNAL_SERVER_ERROR.status).json(RES_INTERNAL_SERVER_ERROR);
  }
}

export default async function handler(req, res) {
  const validate = await verify(decryptCrypto(req.cookies["access_token"]))
    .then((data) => data)
    .catch(() => null);

  if (validate === null) {
    return res.status(RES_UNAUTHORIZE.status).json(RES_UNAUTHORIZE);
  }

  req.validate = validate;

  // ROUTES
  const { slug } = req.query;
  const api = slug.join("/");

  const routes = {
    "get-all": getAll,
    "get-name": getName,
    "get-detail": getDetailSiswa,
    "edit-user": editSiswa,
    "add-user": addSiswa,
    "delete-user": deleteSiswa,
    "get-dropdown-siswa": getDropdownSiswa,
  };

  if (routes[api]) {
    return await routes[api](req, res);
  } else {
    return res.status(404).json({ status: 404, message: "Route Not Found" });
  }
}
