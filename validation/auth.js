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
  NISN: yup.string().required("nisn harus diisi"),
  "Nomor Induk Sekolah": yup.string().required("nomor induk sekolah harus diisi"),
  "Tingkat Kelas": yup.string().required("tingkat kelas harus dipilih 1 - 6"),
  Username: yup.string().min(4, "username minimal 4 digit/karakter").required("username harus diisi"),
  Password: yup.string().min(6, "password minimal 6 karakter").required("password harus diisi"),
  "Nama Siswa": yup.string().min(3, "nama siswa minimal 3 karakter").required("nama siswa harus diisi"),
  "Tempat Lahir": yup.string().min(3, "tempat lahir minimal 3 karakter").required("tempat lahir harus diisi"),
  "Tanggal Lahir": yup.string().required("tangal lahir harus diisi"),
  "Jenis Kelamin": yup
    .string()
    .matches(/^(Laki - Laki|Perempuan)$/i, 'Jenis Kelamin hanya "Laki - Laki" / "Perempuan"')
    .required("jenis kelamin harus diisi"),
  Alamat: yup.string().min(5, "alamat minimal 5 karakter").required("alamat harus diisi"),
  "Nomor Telepon": yup.string().min(7, "nomor telepon minimal 7 karakter").required("nomor telepon harus diisi"),
  "Status Tempat Tinggal": yup
    .string()
    .matches(/^(Rumah Kontrak|Rumah Pribadi)$/i, 'Status Tempat Tinggal hanya "Rumah Kontrak" / "Rumah Pribadi"')
    .required("status tempat tinggal harus diisi"),
  "Jumlah Saudara Kandung": yup.number().required("jumlah saudara kandung harus diisi"),
  "Status Pekerjaan Ayah": yup
    .string()
    .matches(/^(Bekerja|Tidak Bekerja)$/i, 'Status Pekerjaan hanya "Bekerja" / "Tidak Bekerja"')
    .required("status pekerjaan harus diisi"),
  "Nama Ayah": yup.string().min(3, "nama ayah minimal 3 karakter").required("nama ayah harus diisi"),
  "Jenis Pekerjaan Ayah": yup.string().optional(),
  "Pendapatan Ayah Perbulan": yup.number().optional(),
  "Status Pekerjaan Ibu": yup
    .string()
    .matches(/^(Bekerja|Tidak Bekerja)$/i, 'Status Pekerjaan hanya "Bekerja" / "Tidak Bekerja"')
    .required("status pekerjaan harus diisi"),
  "Nama Ibu": yup.string().min(3, "nama ibu minimal 3 karakter").required("nama ibu harus diisi"),
  "Jenis Pekerjaan Ibu": yup.string().optional(),
  "Pendapatan Ibu Perbulan": yup.number().optional(),
});

export const mapperRequest = {
  NISN: "nisn",
  "Nomor Induk Sekolah": "no_induk_sekolah",
  "Tingkat Kelas": "tingkat_kelas",
  Username: "username",
  Password: "password",
  "Nama Siswa": "nama",
  "Tempat Lahir": "tempat_lahir",
  "Tanggal Lahir": "tanggal_lahir",
  "Jenis Kelamin": "jenis_kelamin",
  Alamat: "alamat",
  "Nomor Telepon": "no_telp",
  "Status Tempat Tinggal": "status_tempat_tinggal",
  "Jumlah Saudara Kandung": "jumlah_anggota_keluarga",
  "Status Pekerjaan Ayah": "is_ayah_bekerja",
  "Nama Ayah": "nama_ayah",
  "Jenis Pekerjaan Ayah": "jenis_pekerjaan_ayah",
  "Pendapatan Ayah Perbulan": "pendapatan_perbulan_ayah",
  "Status Pekerjaan Ibu": "is_ibu_bekerja",
  "Nama Ibu": "nama_ibu",
  "Jenis Pekerjaan Ibu": "jenis_pekerjaan_ibu",
  "Pendapatan Ibu Perbulan": "pendapatan_perbulan_ibu",
};
