import * as yup from "yup";

export const penerimaBantuanSchema = yup.object().shape({
  tingkat_kelas: yup.string().required("wajib memilih tingkat kelas"),
  semester: yup.string().required("wajib memilih semester"),
  tahun_ajaran: yup.string().required("wajib memilih tahun ajaran"),
});
