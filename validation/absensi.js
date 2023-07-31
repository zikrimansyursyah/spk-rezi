import * as yup from "yup";

export const absensiSchema = yup.object().shape({
  id_siswa: yup.number("wajib memilih siswa").required("wajib memilih siswa"),
  bulan: yup.string().required("wajib memilih bulan"),
  tahun: yup.string().required("wajib memilih tahun"),
  hadir: yup.number().required("wajib mengisi jumlah hadir"),
  izin: yup.number().required("wajib mengisi jumlah izin"),
  sakit: yup.number().required("wajib mengisi jumlah sakit"),
  alfa: yup.number().required("wajib mengisi jumlah alfa"),
  jumlah_pertemuan: yup.number("wajib memilih siswa").required("wajib mengisi jumlah pertemuan"),
});

export const viewAbsensiSchema = yup.object().shape({
  tingkat_kelas: yup.string().required("wajib memilih tingkat kelas"),
  bulan: yup.string().required("wajib memilih bulan"),
  tahun: yup.string().required("wajib memilih tahun"),
  first: yup.number().required(),
  rows: yup.number().required(),
});

export const mapperRequestAbsensi = {
  "nomor induk siswa": "nomor_induk_siswa",
  nama: "nama",
  bulan: "bulan",
  tahun: "tahun",
  "jumlah pertemuan": "jumlah_pertemuan",
  hadir: "hadir",
  izin: "izin",
  sakit: "sakit",
  alfa: "alfa",
};
