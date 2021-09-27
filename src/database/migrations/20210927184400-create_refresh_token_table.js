'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RefreshTokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      token: {
        type: Sequelize.TEXT,
      },
      createAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updateAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: 'Users' },
          key: 'id',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
      },
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('RefreshTokens');
  },
};
