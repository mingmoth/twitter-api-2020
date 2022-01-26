'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.addColumn('Messages', 'type', {
      type: Sequelize.STRING
    } )
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Messages', 'type')
  }
};
