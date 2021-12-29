'use strict';
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        email: 'root@example.com',
        name: 'root',
        account: 'root',
        role: 'admin',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user1@example.com',
        name: 'user1',
        account: 'user1',
        role: 'user',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
