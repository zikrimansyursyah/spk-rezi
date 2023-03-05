"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Bobot", [
      {
        // Anggota Keluarga
        kode: "C1",
        nama_kriteria: "Anggota Keluarga",
        tipe_kriteria: "benefit",
        bobot: 0.1,
      },
      {
        // Status Pekerjaan Orang Tua
        kode: "C2",
        nama_kriteria: "Status Pekerjaan Orang Tua",
        tipe_kriteria: "cost",
        bobot: 0.15,
      },
      {
        // Status Tempat Tinggal
        kode: "C3",
        nama_kriteria: "Status Tempat Tinggal",
        tipe_kriteria: "cost",
        bobot: 0.1,
      },
      {
        // Pendapatan Perbulan
        kode: "C4",
        nama_kriteria: "Pendapatan Perbulan",
        tipe_kriteria: "cost",
        bobot: 0.3,
      },
      {
        // Absensi Anak
        kode: "C5",
        nama_kriteria: "Absensi Anak",
        tipe_kriteria: "benefit",
        bobot: 0.15,
      },
      {
        // Prestasi
        kode: "C6",
        nama_kriteria: "Prestasi",
        tipe_kriteria: "benefit",
        bobot: 0.2,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Bobot", null, {});
  },
};
