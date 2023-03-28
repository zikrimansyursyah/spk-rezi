import { RES_BAD_REQUEST, RES_INTERNAL_SERVER_ERROR, RES_METHOD_NOT_ALLOWED, RES_UNAUTHORIZE } from "@/services/constants";
import { decryptCrypto } from "@/utils/crypto";
import { verify } from "@/utils/jwt";
import { validateSchema } from "@/validation";
import { absensiSchema, viewAbsensiSchema } from "@/validation/absensi";
import { Op } from "sequelize";

const db = require("@/database/models");
const sequelize = db.sequelize;
const Absensi = db.absensi;

async function addAbsensi(req, res) {
  if (req.method.toUpperCase() !== "POST") {
    return res.status(RES_METHOD_NOT_ALLOWED.status).json(RES_METHOD_NOT_ALLOWED);
  }

  const value = validateSchema(absensiSchema, req.body);

  // IF INVALID REQUEST
  if (value._error) {
    return res.status(RES_BAD_REQUEST.status).json({ status: RES_BAD_REQUEST.status, message: value.message });
  }

  try {
    const absen = await Absensi.findOne({
      where: {
        id_siswa: value.id_siswa,
        bulan: value.bulan,
        tahun: value.tahun,
      },
    });

    if (absen) {
      return res.status(400).json({ status: 400, message: `Absensi bulan ${value.bulan} di tahun ${value.tahun}  Sudah Ada` });
    }

    await Absensi.create({ ...value, created_date: new Date(), updated_date: new Date(), created_by: req.validate.id, updated_by: req.validate.id });

    return res.status(200).json({ status: 200, message: "Berhasil Menambahkan Absensi" });
  } catch (error) {
    return res.status(RES_INTERNAL_SERVER_ERROR.status).json(RES_INTERNAL_SERVER_ERROR);
  }
}

async function editAbsensi(req, res) {
  if (req.method.toUpperCase() !== "PUT") {
    return res.status(RES_METHOD_NOT_ALLOWED.status).json(RES_METHOD_NOT_ALLOWED);
  }

  const value = validateSchema(absensiSchema, req.body);

  // IF INVALID REQUEST
  if (value._error) {
    return res.status(RES_BAD_REQUEST.status).json({ status: RES_BAD_REQUEST.status, message: value.message });
  }

  try {
    const absen = await Absensi.findOne({
      where: {
        id_siswa: value.id_siswa,
        bulan: value.bulan,
        tahun: value.tahun,
      },
    });

    if (!absen) {
      return res.status(404).json({ status: 404, message: `Absensi bulan ${value.bulan} di tahun ${value.tahun} Tidak Ada` });
    }

    delete value.id_siswa;

    await absen.update({ ...value, updated_date: new Date(), updated_by: req.validate.id });

    return res.status(200).json({ status: 200, message: "Berhasil Mengubah Absensi" });
  } catch (error) {
    return res.status(RES_INTERNAL_SERVER_ERROR.status).json(RES_INTERNAL_SERVER_ERROR);
  }
}

async function deleteAbsensi(req, res) {
  if (req.method.toUpperCase() !== "DELETE") {
    return res.status(RES_METHOD_NOT_ALLOWED.status).json(RES_METHOD_NOT_ALLOWED);
  }

  try {
    const absen = await Absensi.findByPk(req.body.id);

    if (!absen) {
      return res.status(404).json({ status: 404, message: `Absensi Tidak Ditemukan` });
    }

    await absen.destroy();

    return res.status(200).json({ status: 200, message: "Berhasil Menghapus Absensi" });
  } catch (error) {
    return res.status(RES_INTERNAL_SERVER_ERROR.status).json(RES_INTERNAL_SERVER_ERROR);
  }
}

async function viewAbsensi(req, res) {
  if (req.method.toUpperCase() !== "POST") {
    return res.status(RES_METHOD_NOT_ALLOWED.status).json(RES_METHOD_NOT_ALLOWED);
  }

  const value = validateSchema(viewAbsensiSchema, req.body);

  // IF INVALID REQUEST
  if (value._error) {
    return res.status(RES_BAD_REQUEST.status).json({ status: RES_BAD_REQUEST.status, message: value.message });
  }

  const { tingkat_kelas, bulan, tahun, first, rows } = value;

  try {
    let condition = tingkat_kelas === "all" ? { bulan, tahun } : { bulan, tahun, [Op.and]: [sequelize.literal(`absensi.id_siswa IN (SELECT id FROM users WHERE tingkat_kelas = ${tingkat_kelas})`)] };
    const { rows: data, count } = await Absensi.findAndCountAll({
      where: condition,
      attributes: {
        exclude: ["created_date", "created_by", "updated_date", "updated_by"],
        include: [
          [
            sequelize.literal(`(
              SELECT users.nama
              FROM users as users
              WHERE users.id = absensi.id_siswa
            )`),
            "nama",
          ],
          [
            sequelize.literal(`(
              SELECT users.no_induk_sekolah
              FROM users as users
              WHERE users.id = absensi.id_siswa
            )`),
            "no_induk_sekolah",
          ],
        ],
      },
      limit: rows,
      offset: first,
      logging: console.log,
    });

    return res.status(200).json({ status: 200, message: "Berhasil Melihat Absensi", data, count });
  } catch (error) {
    console.log(error);
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
    "add-absen": addAbsensi,
    "get-absen": viewAbsensi,
    "edit-absen": editAbsensi,
    "hapus-absen": deleteAbsensi,
  };

  if (routes[api]) {
    return await routes[api](req, res);
  } else {
    return res.status(404).json({ status: 404, message: "Route Not Found" });
  }
}
