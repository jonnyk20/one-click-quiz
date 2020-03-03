"use strict";

const getTestAnimals = require("../utils/getTestAnimals");

const getDates = () => ({
  createdAt: new Date(),
  updatedAt: new Date()
});

const addDates = records => records.map(r => ({ ...r, ...getDates() }));

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const insertRecords = async (model, records, options = {}) => {
      await queryInterface.bulkInsert(model, addDates(records), {}, options);
    };

    const getFirstIdByValue = async (model, column, value) => {
      const modelTypeRecords = await queryInterface.sequelize.query(
        `SELECT id FROM "${model}" WHERE ${column} = '${value}'`
      );
      try {
        const id = modelTypeRecords[0][0].id;
        return id;
      } catch (err) {
        console.log("Error Querying", model, err);
        return null;
      }
    };

    const getAllIds = async model => {
      const records = await queryInterface.sequelize.query(
        `SELECT id FROM "${model}";`
      );

      return records[0].map(({ id }) => id);
    };

    await insertRecords("ItemTypes", [{ name: "image-item" }]);
    await insertRecords("QuizTypes", [{ name: "image-quiz" }]);

    const itemTypeId = await getFirstIdByValue(
      "ItemTypes",
      "name",
      "image-item"
    );

    insertRecords("Items", getTestAnimals(itemTypeId), {
      data: { type: new Sequelize.JSON() }
    });

    const quizTypeId = await getFirstIdByValue(
      "QuizTypes",
      "name",
      "image-quiz"
    );

    await insertRecords("Quizzes", [{ quizTypeId, name: "test-quiz" }]);
    const quizId = await getFirstIdByValue("Quizzes", "name", "test-quiz");

    const itemIds = await getAllIds("Items");
    const questionCount = Math.ceil(itemIds.length / 4);

    const questions = [];
    for (let i = 0; i < questionCount; i++) {
      const correctAnswerIndex = Math.floor(Math.random() * 4);
      questions.push({ correctAnswerIndex, quizId });
    }

    await insertRecords("Questions", questions);

    const questionIds = await getAllIds("Questions");

    const choices = itemIds.map((itemId, i) => ({
      itemId,
      questionId: questionIds[Math.floor(i / 4)]
    }));

    await insertRecords("Choices", choices);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("QuizTypes", null, {});
    await queryInterface.bulkDelete("Quizzes", null, {});
    await queryInterface.bulkDelete("ItemTypes", null, {});
    await queryInterface.bulkDelete("Items", null, {});
    await queryInterface.bulkDelete("Choices", null, {});
    await queryInterface.bulkDelete("Questions", null, {});
  }
};
