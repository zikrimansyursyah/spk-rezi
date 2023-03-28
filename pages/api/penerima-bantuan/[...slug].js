import { RES_BAD_REQUEST, RES_INTERNAL_SERVER_ERROR, RES_METHOD_NOT_ALLOWED, RES_UNAUTHORIZE } from "@/services/constants";
import { decryptCrypto } from "@/utils/crypto";
import { verify } from "@/utils/jwt";
import { validateSchema } from "@/validation";
import { penerimaBantuanSchema } from "@/validation/penerimaBantuan";
import { Op, QueryTypes } from "sequelize";

const db = require("@/database/models");
const sequelize = db.sequelize;
const Users = db.users;
const Absensi = db.absensi;
const Prestasi = db.prestasi;

async function viewDataPenerima(req, res) {
  if (req.method.toUpperCase() !== "POST") {
    return res.status(RES_METHOD_NOT_ALLOWED.status).json(RES_METHOD_NOT_ALLOWED);
  }

  const value = validateSchema(penerimaBantuanSchema, req.body);

  // IF INVALID REQUEST
  if (value._error) {
    return res.status(RES_BAD_REQUEST.status).json({ status: RES_BAD_REQUEST.status, message: value.message });
  }

  const { tingkat_kelas, semester, tahun_ajaran } = value;

  try {
    // MENENTUKAN DATA WHERE SEBELUM EXECUTE QUERY
    const tahun = tahun_ajaran.split("/")[semester === "ganjil" ? 0 : 1];
    const bulan = semester === "ganjil" ? ["'Juli'", "'Agustus'", "'September'", "'Oktober'", "'November'", "'Desember'"] : ["'Januari'", "'Februari'", "'Maret'", "'April'", "'Mei'", "'Juni'"];

    // GET DATA SISWA - ABSENSI - PRESTASI
    const data = await sequelize.query(
      `
    SELECT a.id, a.no_induk_sekolah, a.nama, a.nama_ayah, a.nama_ibu,
    CASE 
      WHEN (a.jumlah_saudara_kandung + 2) = 2 THEN 1
      WHEN (a.jumlah_saudara_kandung + 2) = 3 THEN 2
      WHEN (a.jumlah_saudara_kandung + 2) IN (4,5) THEN 3
      ELSE 4
    END AS c1,
    CASE 
      WHEN a.is_ayah_bekerja = TRUE AND a.is_ibu_bekerja = TRUE THEN 3
      WHEN a.is_ayah_bekerja = TRUE OR a.is_ibu_bekerja = TRUE THEN 2
      ELSE 1
    END AS c2,
    CASE 
      WHEN a.status_tempat_tinggal = 'pribadi' THEN 2
      ELSE 1
    END AS c3,
    CASE 
      WHEN (a.pendapatan_perbulan_ayah + a.pendapatan_perbulan_ibu) <= 3000000 THEN 1
      WHEN (a.pendapatan_perbulan_ayah + a.pendapatan_perbulan_ibu) > 3000000 AND (a.pendapatan_perbulan_ayah + a.pendapatan_perbulan_ibu) < 5000001 THEN 2
      WHEN (a.pendapatan_perbulan_ayah + a.pendapatan_perbulan_ibu) > 5000000 AND (a.pendapatan_perbulan_ayah + a.pendapatan_perbulan_ibu) < 7000001 THEN 3
      ELSE 4
    END AS c4,
    CASE 
      WHEN a.total_alfa IS NULL OR a.total_alfa = 0 THEN 4
      WHEN a.total_alfa = 1 THEN 3
      WHEN a.total_alfa IN (2,3) THEN 2
      ELSE 1
    END AS c5,
    CASE 
      WHEN a.prestasi = '1' THEN 4
      WHEN a.prestasi IN ('2','3') THEN 3
      WHEN a.prestasi IN ('4','5', '6', '7', '8', '9', '10') THEN 2
      ELSE 1
    END AS c6
    FROM 
    (SELECT u.*,
      (SELECT SUM(alfa) AS total_alfa
      FROM absensi
      WHERE id_siswa = u.id 
      AND tahun = '${tahun}' AND bulan IN (${bulan.join(",")})) AS total_alfa,
      (SELECT ranking
      FROM prestasi
      WHERE id_siswa = u.id
      AND tahun_ajaran = '${tahun_ajaran}' AND semester = '${semester}') AS prestasi
    FROM users u
    WHERE u.user_type = 'siswa' AND u.tingkat_kelas = '${tingkat_kelas}') a
    `,
      { type: QueryTypes.SELECT }
    );

    // GET DATA BOBOT DAN BOBOT NILAI
    const bobot = await sequelize.query(
      `
    SELECT LOWER(b.kode) AS kode, b.tipe_kriteria, b.bobot, MAX(bn.nilai) AS nilai_max, MIN(bn.nilai) AS nilai_min
    FROM bobot b 
    JOIN bobot_nilai bn ON bn.id_bobot = b.id
    GROUP BY b.kode, b.tipe_kriteria, b.bobot 
    `,
      { type: QueryTypes.SELECT }
    );

    // PARSING ATTRIBUTES BOBOT
    let attributes = {};
    for (const v of bobot) {
      attributes[v.kode] = v;
    }

    // MELAKUKAN NORMALISASI MATRIKS
    let result = {};
    for (const row of data) {
      let normalisasi = [];
      Object.keys(row).map((val) => {
        if (!["id", "no_induk_sekolah", "nama", "nama_ayah", "nama_ibu"].includes(val)) {
          if (attributes[val].tipe_kriteria === "benefit") {
            normalisasi.push({ [val]: row[val] / attributes[val].nilai_max });
          } else {
            normalisasi.push({ [val]: attributes[val].nilai_min / row[val] });
          }
        }
      });
      result[row.id] = normalisasi;
    }

    // PENGKALIAN DAN PENJUMLAHAN HASIL NORMALISASI DENGAN BOBOT
    let hasilAkhir = [];
    Object.keys(result).map((val) => {
      let hasil = 0;
      for (const data of result[val]) {
        Object.keys(data).map((item) => {
          let bobot = parseFloat(attributes[item].bobot);
          hasil += data[item] * bobot;
        });
      }
      let dataUser = data.find((v) => v.id === Number(val));
      hasilAkhir.push({
        id: dataUser.id,
        no_induk_sekolah: dataUser.no_induk_sekolah,
        nama: dataUser.nama,
        nama_ayah: dataUser.nama_ayah,
        nama_ibu: dataUser.nama_ibu,
        nilai: parseFloat(hasil).toFixed(3),
      });
    });

    hasilAkhir.sort((a, b) => b.nilai - a.nilai);

    return res.status(200).json({ status: 200, message: "Berhasil Mendapatkan Data Penerima Bantuan", data: { data, attributes, result, ranking: hasilAkhir } });
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
    get: viewDataPenerima,
  };

  if (routes[api]) {
    return await routes[api](req, res);
  } else {
    return res.status(404).json({ status: 404, message: "Route Not Found" });
  }
}
