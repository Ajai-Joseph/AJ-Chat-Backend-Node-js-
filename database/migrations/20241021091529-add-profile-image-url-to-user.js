'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'profileImageUrl', {
      type: Sequelize.STRING,
      allowNull: true, 
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'profileImageUrl');

  }
};
