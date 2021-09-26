'use strict';

module.exports = {
  // for migrate
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(),
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING(50),
        unique: true,
      },
      firstName: {
        type: Sequelize.STRING(50),
      },
      lastName: {
        type: Sequelize.STRING(50),
      },
      createAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updateAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },
  // for roll back
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users')
  },
};
