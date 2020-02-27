"use strict";
module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    "Question",
    {
      correctAnswerIndex: DataTypes.INTEGER
    },
    {}
  );
  Question.associate = function(models) {
    Question.belongsTo(models.Quiz, { foreignKey: "quizId" });
    Question.hasMany(models.Choice, { foreignKey: "questionId" });
  };
  return Question;
};
