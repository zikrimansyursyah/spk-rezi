"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_type: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ["admin", "siswa"],
      },
      nisn: Sequelize.STRING,
      no_induk_sekolah: Sequelize.STRING,
      nama: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tempat_lahir: Sequelize.STRING,
      tanggal_lahir: Sequelize.DATE,
      jenis_kelamin: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ["laki-laki", "perempuan"],
      },
      alamat: Sequelize.STRING,
      no_telp: Sequelize.STRING,
      status_tempat_tinggal: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      jumlah_anggota_keluarga: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      is_ayah_bekerja: {
        type: Sequelize,
        allowNull: false,
      },
      nama_ayah: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      jenis_pekerjaan_ayah: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pendapatan_perbulan_ayah: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      is_ibu_bekerja: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      nama_ibu: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      jenis_pekerjaan_ibu: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pendapatan_perbulan_ibu: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_date: Sequelize.DATE,
      created_by: Sequelize.INTEGER,
      updated_date: Sequelize.DATE,
      updated_by: Sequelize.INTEGER,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
