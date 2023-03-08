import * as yup from "yup";

export const loginSchema = yup.object().shape({
  username: yup.string().min(4, "username minimal 4 digit/karakter").required("masukan username/NIS anda"),
  password: yup.string().min(5, "password minimal 6 karakter").required("password harus diisi"),
  is_remember: yup.boolean().required("is_remember wajib dipilih"),
});

export const userSchema = yup.object().shape({
  nisn: yup.string().min(8, "nisn minimal 8 digit angka").required("nisn harus diisi"),
  no_induk_sekolah: yup.string().min(5, "nomor induk sekolah minimal 5 digit angka").required("nomor induk sekolah harus diisi"),
  username: yup.string().min(4, "username minimal 4 digit/karakter").required("masukan username/NIS anda"),
  password: yup.string().min(5, "password minimal 6 karakter").required("password harus diisi"),
  nama: yup.string().min(3, "nama minimal 3 karakter").required("nama harus diisi"),
  tempat_lahir: yup.string().min(3, "tempat lahir minimal 3 karakter").required("tempat lahir harus diisi"),
  tanggal_lahir: yup.string().required("tangal lahir harus diisi"),
  jenis_kelamin: yup.string().required("jenis kelamin harus dipilih"),
  alamat: yup.string().min(5, "alamat minimal 5 karakter").required("alamat harus diisi"),
  no_telp: yup.string().min(7, "nomor telepon minimal 7 karakter").required("nomor telepon harus diisi"),
  status_tempat_tinggal: yup.string().required("status tempat tinggal harus dipilih"),
  is_ayah_bekerja: yup.boolean().required("status pekerjaan ayah wajib dipilih"),
  nama_ayah: yup.string().min(3, "nama ayah minimal 3 karakter").required("nama ayah harus diisi"),
  jenis_pekerjaan_ayah: yup.string().optional(),
  pendapatan_perbulan_ayah: yup.number().optional(),
  is_ibu_bekerja: yup.boolean().required("status pekerjaan ibu wajib dipilih"),
  nama_ibu: yup.string().min(3, "nama ibu minimal 3 karakter").required("nama ibu harus diisi"),
  jenis_pekerjaan_ibu: yup.string().optional(),
  pendapatan_perbulan_ibu: yup.number().optional(),
});
