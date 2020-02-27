"use strict";
module.exports = (sequelize, DataTypes) => {
  const Quiz = sequelize.define(
    "Quiz",
    {
      name: DataTypes.STRING,
      url: DataTypes.STRING
    },
    {}
  );
  Quiz.associate = function(models) {
    Quiz.belongsTo(models.QuizType, { foreignKey: "quizTypeId" });
    Quiz.hasMany(models.Question, { foreignKey: "quizId" });
  };
  return Quiz;
};
