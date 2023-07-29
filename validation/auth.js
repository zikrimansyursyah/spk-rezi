import * as yup from "yup";

export const loginSchema = yup.object().shape({
  username: yup.string().min(4, "username minimal 4 digit/karakter").required("masukan username/NIS anda"),
  password: yup.string().min(5, "password minimal 6 karakter").required("password harus diisi"),
  is_remember: yup.boolean().required("is_remember wajib dipilih"),
});

export const userSchema = yup.object().shape({
  nisn: yup.string().min(8, "nisn minimal 8 digit angka").required("nisn harus diisi"),
  no_induk_sekolah: yup.string().min(5, "nomor induk sekolah minimal 5 digit angka").required("nomor induk sekolah harus diisi"),
  tingkat_kelas: yup.string().required("tingkat kelas harus dipilih"),
  username: yup.string().min(4, "username minimal 4 digit/karakter").required("masukan username/NIS anda"),
  password: yup.string().min(5, "password minimal 6 karakter").required("password harus diisi"),
  nama: yup.string().min(3, "nama minimal 3 karakter").required("nama harus diisi"),
  tempat_lahir: yup.string().min(3, "tempat lahir minimal 3 karakter").required("tempat lahir harus diisi"),
  tanggal_lahir: yup.string().required("tangal lahir harus diisi"),
  jenis_kelamin: yup.string().required("jenis kelamin harus dipilih"),
  alamat: yup.string().min(5, "alamat minimal 5 karakter").required("alamat harus diisi"),
  no_telp: yup.string().min(7, "nomor telepon minimal 7 karakter").required("nomor telepon harus diisi"),
  status_tempat_tinggal: yup.string().required("status tempat tinggal harus dipilih"),
  jumlah_anggota_keluarga: yup.number().required("jumlah saudara kandung harus diisi"),
  is_ayah_bekerja: yup.boolean().required("status pekerjaan ayah wajib dipilih"),
  nama_ayah: yup.string().min(3, "nama ayah minimal 3 karakter").required("nama ayah harus diisi"),
  jenis_pekerjaan_ayah: yup.string().optional(),
  pendapatan_perbulan_ayah: yup.number().optional(),
  is_ibu_bekerja: yup.boolean().required("status pekerjaan ibu wajib dipilih"),
  nama_ibu: yup.string().min(3, "nama ibu minimal 3 karakter").required("nama ibu harus diisi"),
  jenis_pekerjaan_ibu: yup.string().optional(),
  pendapatan_perbulan_ibu: yup.number().optional(),
});

export const userImportSchema = yup.object().shape({
  nisn: yup
    .string()
    .matches(/^[0-9]+$/, "nisn hanya berupa angka")
    .required("nisn harus diisi"),
  no_induk_sekolah: yup
    .string()
    .matches(/^[0-9]+$/, "nomor induk sekolah hanya berupa angka")
    .required("nomor induk sekolah harus diisi"),
  tingkat_kelas: yup
    .string()
    .matches(/^(1|2|3|4|5|6|Lulus|lulus)$/i, "tingkat kelas harus diisi 1 - 6 atau 'Lulus'")
    .required("tingkat kelas harus diisi"),
  username: yup.string().matches(/^\S*$/, "username tidak boleh mengandung spasi").min(4, "username minimal 4 digit/karakter").required("username harus diisi"),
  password: yup.string().min(6, "password minimal 6 karakter").required("password harus diisi"),
  nama: yup.string().min(3, "nama siswa minimal 3 karakter").required("nama siswa harus diisi"),
  tempat_lahir: yup.string().min(3, "tempat lahir minimal 3 karakter").required("tempat lahir harus diisi"),
  tanggal_lahir: yup
    .string()
    .matches(/^(0[1-9]|[1-2]\d|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/, "tanggal lahir harus sesuai format angka")
    .required("tangal lahir harus diisi"),
  jenis_kelamin: yup
    .string()
    .matches(/^(Laki - Laki|Perempuan)$/i, 'Jenis Kelamin hanya "Laki - Laki" / "Perempuan"')
    .required("jenis kelamin harus diisi"),
  alamat: yup.string().min(5, "alamat minimal 5 karakter").required("alamat harus diisi"),
  no_telp: yup.string().min(7, "nomor telepon minimal 7 karakter").required("nomor telepon harus diisi"),
  status_tempat_tinggal: yup
    .string()
    .matches(/^(Rumah Kontrak|Rumah Pribadi)$/i, 'Status Tempat Tinggal hanya "Rumah Kontrak" / "Rumah Pribadi"')
    .required("status tempat tinggal harus diisi"),
  jumlah_anggota_keluarga: yup.number().required("jumlah saudara kandung harus diisi"),
  is_ayah_bekerja: yup
    .string()
    .matches(/^(Bekerja|Tidak Bekerja)$/i, 'Status Pekerjaan hanya "Bekerja" / "Tidak Bekerja"')
    .required("status pekerjaan harus diisi"),
  nama_ayah: yup.string().min(3, "nama ayah minimal 3 karakter").required("nama ayah harus diisi"),
  jenis_pekerjaan_ayah: yup.string().optional(),
  pendapatan_perbulan_ayah: yup.number().optional(),
  is_ibu_bekerja: yup
    .string()
    .matches(/^(Bekerja|Tidak Bekerja)$/i, 'Status Pekerjaan hanya "Bekerja" / "Tidak Bekerja"')
    .required("status pekerjaan harus diisi"),
  nama_ibu: yup.string().min(3, "nama ibu minimal 3 karakter").required("nama ibu harus diisi"),
  jenis_pekerjaan_ibu: yup.string().optional(),
  pendapatan_perbulan_ibu: yup.number().optional(),
});

export const mapperRequest = {
  nisn: "nisn",
  "nomor induk sekolah": "no_induk_sekolah",
  "tingkat kelas": "tingkat_kelas",
  username: "username",
  password: "password",
  "nama siswa": "nama",
  "tempat lahir": "tempat_lahir",
  "tanggal lahir": "tanggal_lahir",
  "jenis kelamin": "jenis_kelamin",
  alamat: "alamat",
  "nomor telepon": "no_telp",
  "status tempat tinggal": "status_tempat_tinggal",
  "jumlah saudara kandung": "jumlah_anggota_keluarga",
  "status pekerjaan ayah": "is_ayah_bekerja",
  "nama ayah": "nama_ayah",
  "jenis pekerjaan ayah": "jenis_pekerjaan_ayah",
  "pendapatan ayah perbulan": "pendapatan_perbulan_ayah",
  "status pekerjaan ibu": "is_ibu_bekerja",
  "nama ibu": "nama_ibu",
  "jenis pekerjaan ibu": "jenis_pekerjaan_ibu",
  "pendapatan ibu perbulan": "pendapatan_perbulan_ibu",
};
