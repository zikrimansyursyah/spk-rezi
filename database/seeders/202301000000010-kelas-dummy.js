'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Kelas', [
      {
        kelas_type: 1,
        nama_kelas: '1.A'
      },
      {
        kelas_type: 1,
        nama_kelas: '1.B'
      },
      {
        kelas_type: 1,
        nama_kelas: '1.C'
      },
      {
        kelas_type: 2,
        nama_kelas: '2.A'
      },
      {
        kelas_type: 2,
        nama_kelas: '2.B'
      },
      {
        kelas_type: 2,
        nama_kelas: '2.C'
      },
      {
        kelas_type: 3,
        nama_kelas: '3.A'
      },
      {
        kelas_type: 3,
        nama_kelas: '3.B'
      },
      {
        kelas_type: 3,
        nama_kelas: '3.C'
      },
      {
        kelas_type: 4,
        nama_kelas: '4.A'
      },
      {
        kelas_type: 4,
        nama_kelas: '4.B'
      },
      {
        kelas_type: 4,
        nama_kelas: '4.C'
      },
      {
        kelas_type: 5,
        nama_kelas: '5.A'
      },
      {
        kelas_type: 5,
        nama_kelas: '5.B'
      },
      {
        kelas_type: 5,
        nama_kelas: '5.C'
      },
      {
        kelas_type: 6,
        nama_kelas: '6.A'
      },
      {
        kelas_type: 6,
        nama_kelas: '6.B'
      },
      {
        kelas_type: 6,
        nama_kelas: '6.C'
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Kelas', null, {});
  }
};
