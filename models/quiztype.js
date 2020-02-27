"use strict";
module.exports = (sequelize, DataTypes) => {
  const QuizType = sequelize.define(
    "QuizType",
    {
      name: DataTypes.STRING
    },
    {}
  );
  QuizType.associate = function(models) {
    // associations can be defined here
    QuizType.hasMany(models.Quiz, { foreignKey: "quizTypeId" });
  };
  return QuizType;
};
