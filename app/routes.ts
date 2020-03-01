import models from "./db/index";
import { Express, Response } from "express";

const routes = (app: Express) => {
  app.get("/api/quiz/1", async (req: Express.Request, res: Response) => {
    const { Quiz } = models;
    const quiz = await Quiz.findOne();
    const type = await quiz.getQuizType();
    const questionRecords = await quiz.getQuestions();
    const questions = await Promise.all(
      questionRecords.map(async (q: any) => ({
        correctAnswerIndex: q.correctAnswerIndex,
        choices: await Promise.all(
          (await q.getChoices()).map(async (c: any) => (await c.getItem()).data)
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
