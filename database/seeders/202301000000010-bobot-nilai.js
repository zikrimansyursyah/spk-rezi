"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Bobot_Nilai", [
      {
        id_bobot: 1,
        nama_nilai: "> 5 Orang",
        nilai: 4,
      },
      {
        id_bobot: 1,
        nama_nilai: "4-5 Orang",
        nilai: 3,
      },
      {
        id_bobot: 1,
        nama_nilai: "3 Orang",
        nilai: 2,
      },
      {
        id_bobot: 1,
        nama_nilai: "2 Orang",
        nilai: 1,
      },
      {
        id_bobot: 2,
        nama_nilai: "Ayah dan Ibu Tidak Bekerja",
        nilai: 3,
      },
      {
        id_bobot: 2,
        nama_nilai: "Salah satu yang Bekerja",
        nilai: 2,
      },
      {
        id_bobot: 2,
        nama_nilai: "Ayah dan Ibu Bekerja",
        nilai: 1,
      },
      {
        id_bobot: 3,
        nama_nilai: "Rumah Pribadi",
        nilai: 1,
      },
      {
        id_bobot: 3,
        nama_nilai: "Mengontrak",
        nilai: 2,
      },
      {
        id_bobot: 4,
        nama_nilai: "< Rp. 3,000,000.-",
        nilai: 4,
      },
      {
        id_bobot: 4,
        nama_nilai: "Rp. 3,000,001 - Rp. 5,000,000",
        nilai: 3,
      },
      {
        id_bobot: 4,
        nama_nilai: "Rp. 5,000,001 - Rp. 7,000,000",
        nilai: 2,
      },
      {
        id_bobot: 4,
        nama_nilai: "> Rp. 7,000,000",
        nilai: 1,
      },
      {
        id_bobot: 5,
        nama_nilai: "Tidak pernah bolos",
        nilai: 4,
      },
      {
        id_bobot: 5,
        nama_nilai: "Alfa 1x dalam 6 bulan",
        nilai: 3,
      },
      {
        id_bobot: 5,
        nama_nilai: "Alfa 2-3x dalam 6bulan",
        nilai: 2,
      },
      {
        id_bobot: 5,
        nama_nilai: "Alfa > 3x dalam 6bulan",
        nilai: 1,
      },
      {
        id_bobot: 6,
        nama_nilai: "Juara 1 dikelas",
        nilai: 4,
      },
      {
        id_bobot: 6,
        nama_nilai: "Juara 2 atau 3 dikelas",
        nilai: 3,
      },
      {
        id_bobot: 6,
        nama_nilai: "Masuk juara 10 besar dikelas",
        nilai: 2,
      },
      {
        id_bobot: 6,
        nama_nilai: "Tidak juara kelas",
        nilai: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Bobot_Nilai", null, {});
  },
};
