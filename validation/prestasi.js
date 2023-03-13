import * as yup from "yup";

export const viewPrestasiSchema = yup.object().shape({
  semester: yup.string().required("wajib memilih semester"),
  tahun_ajaran: yup.string().required("wajib memilih tahun ajaran"),
  first: yup.number().required(),
  rows: yup.number().required(),
});

export const prestasiSchema = yup.object().shape({
  id_siswa: yup.number("wajib memilih siswa").required("wajib memilih siswa"),
  semester: yup.string().required("wajib memilih semester"),
  tahun_ajaran: yup.string().required("wajib memilih tahun ajaran"),
  ranking: yup.string().required("wajib memilih ranking"),
});
