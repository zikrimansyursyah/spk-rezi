import { RES_BAD_REQUEST, RES_INTERNAL_SERVER_ERROR, RES_METHOD_NOT_ALLOWED, RES_UNAUTHORIZE } from "@/services/constants";
import { decryptCrypto } from "@/utils/crypto";
import { verify } from "@/utils/jwt";
import { validateSchema } from "@/validation";
import { prestasiSchema, viewPrestasiSchema } from "@/validation/prestasi";
import { Op } from "sequelize";

const db = require("@/database/models");
const sequelize = db.sequelize;
const Prestasi = db.prestasi;

async function viewDataPrestasi(req, res) {
  if (req.method.toUpperCase() !== "POST") {
    return res.status(RES_METHOD_NOT_ALLOWED.status).json(RES_METHOD_NOT_ALLOWED);
  }

  const value = validateSchema(viewPrestasiSchema, req.body);

  // IF INVALID REQUEST
  if (value._error) {
    return res.status(RES_BAD_REQUEST.status).json({ status: RES_BAD_REQUEST.status, message: value.message });
  }

  const { tingkat_kelas, semester, tahun_ajaran, first, rows } = value;

  try {
    let where = { tahun_ajaran };
    if (semester !== "all") {
      where.semester = semester;
    }
    if (tingkat_kelas !== "all") {
      where[Op.and] = [sequelize.literal(`prestasi.id_siswa IN (SELECT id FROM users WHERE tingkat_kelas = ${tingkat_kelas})`)];
    }

    const { rows: data, count } = await Prestasi.findAndCountAll({
      where,
      attributes: {
        exclude: ["created_date", "created_by", "updated_date", "updated_by"],
        include: [
          [
            sequelize.literal(`(
              SELECT users.nama
              FROM users as users
              WHERE users.id = prestasi.id_siswa
            )`),
            "nama",
          ],
          [
            sequelize.literal(`(
              SELECT users.no_induk_sekolah
              FROM users as users
              WHERE users.id = prestasi.id_siswa
            )`),
            "no_induk_sekolah",
          ],
        ],
      },
      limit: rows,
      offset: first,
    });

    return res.status(200).json({ status: 200, message: "Berhasil Melihat data Prestasi", data, count });
  } catch (error) {
    console.log(error);
    return res.status(RES_INTERNAL_SERVER_ERROR.status).json(RES_INTERNAL_SERVER_ERROR);
  }
}

async function addPrestasi(req, res) {
  if (req.method.toUpperCase() !== "POST") {
    return res.status(RES_METHOD_NOT_ALLOWED.status).json(RES_METHOD_NOT_ALLOWED);
  }

  const value = validateSchema(prestasiSchema, req.body);

  // IF INVALID REQUEST
  if (value._error) {
    return res.status(RES_BAD_REQUEST.status).json({ status: RES_BAD_REQUEST.status, message: value.message });
  }

  try {
    const exist = await Prestasi.findOne({
      where: {
        id_siswa: value.id_siswa,
        semester: value.semester,
        tahun_ajaran: value.tahun_ajaran,
      },
    });

    if (exist) {
      return res.status(400).json({ status: 400, message: "Data Prestasi sudah ada" });
    }

    await Prestasi.create({ ...value, updated_date: new Date(), created_date: new Date(), created_by: req.validate.id, updated_by: req.validate.id });

    return res.status(200).json({ status: 200, message: "Berhasil Membuat data Prestasi" });
  } catch (error) {
    console.log(error);
    return res.status(RES_INTERNAL_SERVER_ERROR.status).json(RES_INTERNAL_SERVER_ERROR);
  }
}

async function editPrestasi(req, res) {
  if (req.method.toUpperCase() !== "PUT") {
    return res.status(RES_METHOD_NOT_ALLOWED.status).json(RES_METHOD_NOT_ALLOWED);
  }

  const value = validateSchema(prestasiSchema, req.body);

  // IF INVALID REQUEST
  if (value._error) {
    return res.status(RES_BAD_REQUEST.status).json({ status: RES_BAD_REQUEST.status, message: value.message });
  }

  try {
    const prestasi = await Prestasi.findOne({
      where: {
        id_siswa: value.id_siswa,
        semester: value.semester,
        tahun_ajaran: value.tahun_ajaran,
      },
    });

    if (!prestasi) {
      return res.status(400).json({ status: 400, message: "Data Prestasi tidak ada" });
    }

    await prestasi.update({ ...value, updated_date: new Date(), updated_by: req.validate.id });

    return res.status(200).json({ status: 200, message: "Berhasil Mengubah data Prestasi" });
  } catch (error) {
    console.log(error);
    return res.status(RES_INTERNAL_SERVER_ERROR.status).json(RES_INTERNAL_SERVER_ERROR);
  }
}

async function deletePrestasi(req, res) {
  if (req.method.toUpperCase() !== "DELETE") {
    return res.status(RES_METHOD_NOT_ALLOWED.status).json(RES_METHOD_NOT_ALLOWED);
  }

  try {
    const prestasi = await Prestasi.findByPk(req.body.id);

    if (!prestasi) {
      return res.status(400).json({ status: 400, message: "Data Prestasi tidak ada" });
    }

    await prestasi.destroy();

    return res.status(200).json({ status: 200, message: "Berhasil Menghapus data Prestasi" });
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
    "get-all": viewDataPrestasi,
    add: addPrestasi,
    edit: editPrestasi,
    delete: deletePrestasi,
  };

  if (routes[api]) {
    return await routes[api](req, res);
  } else {
    return res.status(404).json({ status: 404, message: "Route Not Found" });
  }
}
