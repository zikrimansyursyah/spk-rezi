'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Enumeration', [
      {
        name: 'admin',
        alt_name: 'administrator',
        code: 'US-001'
      },
      {
        name: 'guru',
        alt_name: 'guru',
        code: 'US-001'
      },
      {
        name: 'siswa',
        alt_name: 'siswa',
        code: 'US-001'
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Enumeration', null, {});
  }
};
