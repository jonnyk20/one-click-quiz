"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Items", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      data: {
        type: Sequelize.JSON
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      itemTypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: "ItemTypes",
          key: "id"
        },
        allowNull: false,
        onUpdate: "cascade",
        onDelete: "cascade"
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Items");
  }
};
