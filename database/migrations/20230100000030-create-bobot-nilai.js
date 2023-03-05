"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Bobot_Nilai", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_bobot: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Bobot",
          key: "id",
        },
      },
      nama_nilai: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nilai: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Bobot_Nilai");
  },
};
