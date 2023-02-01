'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_type: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      id_kelas: Sequelize.INTEGER,
      nik: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nisn: Sequelize.STRING,
      no_induk_sekolah: Sequelize.STRING,
      username: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tempat_lahir: Sequelize.STRING,
      tanggal_lahir: Sequelize.DATE,
      jenis_kelamin: Sequelize.STRING,
      alamat: Sequelize.STRING,
      no_telp: Sequelize.STRING,
      created_date: Sequelize.DATE,
      created_by: Sequelize.INTEGER,
      updated_date: Sequelize.DATE,
      updated_by: Sequelize.INTEGER,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};