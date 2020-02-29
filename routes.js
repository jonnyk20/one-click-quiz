const db = require("./models/index.js");

const routes = app => {
  app.get("/api/quiz/1", async (req, res) => {
    const { Quiz } = db;
    const quiz = await Quiz.findOne();
    const type = await quiz.getQuizType();
    const questionRecords = await quiz.getQuestions();
    const questions = await Promise.all(
      questionRecords.map(async q => ({
        correctAnswerIndex: q.correctAnswerIndex,
        choices: await Promise.all(
          (await q.getChoices()).map(async c => (await c.getItem()).data)
        )
      }))
    );

    const formattedQuiz = {
      name: quiz.name,
      type: type.name,
      questions
    };

    return res.json({ quiz: formattedQuiz });
  });
};

module.exports = routes;
