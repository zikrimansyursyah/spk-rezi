import * as yup from "yup";

export const penerimaBantuanSchema = yup.object().shape({
  first: yup.number().required("first wajib diisi"),
  rows: yup.number().required("rows wajib diisi"),
  tingkat_kelas: yup.string().required("wajib memilih tingkat kelas"),
  semester: yup.string().required("wajib memilih semester"),
  tahun_ajaran: yup.string().required("wajib memilih tahun ajaran"),
  get_all: yup.boolean().optional(),
});
