"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Absensi", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_siswa: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      bulan: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tahun: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hadir: Sequelize.INTEGER,
      izin: Sequelize.INTEGER,
      sakit: Sequelize.INTEGER,
      alfa: Sequelize.INTEGER,
      jumlah_pertemuan: Sequelize.INTEGER,
      created_date: Sequelize.DATE,
      created_by: Sequelize.INTEGER,
      updated_date: Sequelize.DATE,
      updated_by: Sequelize.INTEGER,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Absensi");
  },
};
