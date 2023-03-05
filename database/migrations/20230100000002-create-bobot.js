"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Bobot", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      kode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nama_kriteria: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tipe_kriteria: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ["benefit", "cost"],
      },
      bobot: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Bobot");
  },
};
