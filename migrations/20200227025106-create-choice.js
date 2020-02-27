"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Choices", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      itemId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Items",
          key: "id"
        },
        allowNull: false,
        onUpdate: "cascade",
        onDelete: "cascade"
      },
      questionId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Questions",
          key: "id"
        },
        allowNull: false,
        onUpdate: "cascade",
        onDelete: "cascade"
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Choices");
  }
};
