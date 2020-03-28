'use strict';

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
    await insertRecords('ItemTypes', [{ name: 'sentence-item' }]);
    await insertRecords('QuizTypes', [{ name: 'sentence-quiz' }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ItemTypes', null, {});
    await queryInterface.bulkDelete('QuizTypes', null, {});
  }
};
