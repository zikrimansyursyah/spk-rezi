"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users", [
      {
        // ADMIN
        user_type: "admin",
        nisn: null,
        no_induk_sekolah: null,
        nama: "Administrator",
        username: "admin",
        password: "U2FsdGVkX19I3j53q2XRLGGUh+5sRbmxKpSbaICMHKs=", // admin
        tempat_lahir: null,
        tanggal_lahir: null,
        jenis_kelamin: "laki-laki",
        alamat: null,
        no_telp: null,
        status_tempat_tinggal: "pribadi",
        jumlah_anggota_keluarga: 0,
        is_ayah_bekerja: true,
        nama_ayah: "Superadmin",
        jenis_pekerjaan_ayah: "Karyawan Swasta",
        pendapatan_perbulan_ayah: 0,
        is_ibu_bekerja: false,
        nama_ibu: "Mom admin",
        jenis_pekerjaan_ibu: "Tidak Bekerja",
        pendapatan_perbulan_ibu: 0,
        created_date: new Date(),
        created_by: 1,
        updated_date: null,
        updated_by: null,
      },
      {
        // SISWA
        user_type: "siswa",
        nisn: "123123123123",
        no_induk_sekolah: "000100010001",
        nama: "Azka Ramadhan",
        username: "azkaramadhan",
        password: "U2FsdGVkX19I3j53q2XRLGGUh+5sRbmxKpSbaICMHKs=", // admin
        tempat_lahir: "Tangerang",
        tanggal_lahir: "2011-08-26",
        jenis_kelamin: "laki-laki",
        alamat: "Kp kalipaten RT/RW 02/04",
        no_telp: "083808838936",
        status_tempat_tinggal: "pribadi",
        jumlah_anggota_keluarga: 1,
        is_ayah_bekerja: true,
        nama_ayah: "Daniel",
        jenis_pekerjaan_ayah: "Pegawai Swasta",
        pendapatan_perbulan_ayah: 0,
        is_ibu_bekerja: false,
        nama_ibu: "Yanti Rahayu",
        jenis_pekerjaan_ibu: "Tidak Bekerja",
        pendapatan_perbulan_ibu: 0,
        created_date: new Date(),
        created_by: 1,
        updated_date: null,
        updated_by: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
