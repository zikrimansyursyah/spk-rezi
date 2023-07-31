import * as yup from "yup";

export const viewPrestasiSchema = yup.object().shape({
  tingkat_kelas: yup.string().required("wajib memilih tingkat kelas"),
  semester: yup.string().required("wajib memilih semester"),
  tahun_ajaran: yup.string().required("wajib memilih tahun ajaran"),
  first: yup.number().required(),
  rows: yup.number().required(),
});

export const prestasiSchema = yup.object().shape({
  id_siswa: yup.number("wajib memilih siswa").required("wajib memilih siswa"),
  semester: yup
    .string()
    .matches(/^(ganjil|genap)$/i, "hanya boleh mengisi ganjil atau genap")
    .required("wajib memilih semester"),
  tahun_ajaran: yup
    .string()
    .matches(/^(?:20\d{2}\/20\d{2})$/, "format tahun ajaran tidak sesuai panduan")
    .required("wajib memilih tahun ajaran"),
  ranking: yup
    .string()
    .matches(/^(?:[1-9]|10)$/, "pilihan rangking hanya 1 - 10")
    .required("wajib memilih ranking"),
});

export const mapperRequestPrestasi = {
  semester: "semester",
  "tahun ajaran": "tahun_ajaran",
  ranking: "ranking",
};
