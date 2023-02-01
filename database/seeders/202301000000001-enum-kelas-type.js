'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Enumeration', [
      {
        name: '1',
        alt_name: '1',
        code: 'KL-001'
      },
      {
        name: '2',
        alt_name: '2',
        code: 'KL-001'
      },
      {
        name: '3',
        alt_name: '3',
        code: 'KL-001'
      },
      {
        name: '4',
        alt_name: '4',
        code: 'KL-001'
      },
      {
        name: '5',
        alt_name: '5',
        code: 'KL-001'
      },
      {
        name: '6',
        alt_name: '6',
        code: 'KL-001'
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Enumeration', null, {});
  }
};
