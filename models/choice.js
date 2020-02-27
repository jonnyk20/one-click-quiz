"use strict";
module.exports = (sequelize, DataTypes) => {
  const Choice = sequelize.define("Choice", {}, {});
  Choice.associate = function(models) {
    Choice.belongsTo(models.Item, { foreignKey: "itemId" });
    Choice.belongsTo(models.Question, { foreignKey: "questionId" });
  };
  return Choice;
};
