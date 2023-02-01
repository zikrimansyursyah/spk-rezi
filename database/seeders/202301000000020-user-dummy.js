'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      { // ADMIN
        user_type: 1,
        id_kelas: null,
        nik: '0000000000000000',
        nisn: null,
        no_induk_sekolah: null,
        username: 'admin',
        password: 'U2FsdGVkX19I3j53q2XRLGGUh+5sRbmxKpSbaICMHKs=',
        nama: 'Administrator',
        tempat_lahir: null,
        tanggal_lahir: null,
        jenis_kelamin: null,
        alamat: null,
        no_telp: null,
        created_date: new Date(),
        created_by: null,
        updated_date: null,
        updated_by: null
      },
      { // GURU
        user_type: 2,
        id_kelas: null,
        nik: '3603218473620004',
        nisn: null,
        no_induk_sekolah: '2022001001',
        username: 'fahrezi',
        password: 'U2FsdGVkX1+aTYL9nvbzPb+watqL+Ofz9gtcUyrWTtk=',
        nama: 'Ahmad Fahrezi',
        tempat_lahir: 'Tangerang',
        tanggal_lahir: '1998-03-03',
        jenis_kelamin: 'Laki-Laki',
        alamat: 'Tangerang Kelapa Dua',
        no_telp: '08517263823',
        created_date: new Date(),
        created_by: 1,
        updated_date: null,
        updated_by: null
      },
      { // SISWA
        user_type: 3,
        id_kelas: 15,
        nik: '3603129573840002',
        nisn: "22008374834",
        no_induk_sekolah: '2022002001',
        username: 'gilang',
        password: 'U2FsdGVkX18xfbH+Ze5WMVBaVo2c18w6lGiRejR3ZrE=',
        nama: 'Gilang Anugrah Perdana',
        tempat_lahir: 'Tangerang',
        tanggal_lahir: '2015-01-03',
        jenis_kelamin: 'Laki-Laki',
        alamat: 'Tangerang Kelapa Dua',
        no_telp: '08936472833',
        created_date: new Date(),
        created_by: 1,
        updated_date: null,
        updated_by: null
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
