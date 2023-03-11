"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Prestasi", {
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
      semester: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ["ganjil", "genap"],
      },
      tahun_ajaran: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ranking: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      created_date: Sequelize.DATE,
      created_by: Sequelize.INTEGER,
      updated_date: Sequelize.DATE,
      updated_by: Sequelize.INTEGER,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Prestasi");
  },
};
