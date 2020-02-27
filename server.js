require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const db = require("./models/index.js");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "build")));

app.get("/ping", async (req, res) => {
  const { Quiz } = db;
  const quiz = await Quiz.findOne();
  const type = await quiz.getQuizType();
  const questionRecords = await quiz.getQuestions();
  const questions = await Promise.all(
    questionRecords.map(async q => ({
      correctAnswerIndex: q.correctAnswerIndex,
      choices: await Promise.all(
        (await q.getChoices()).map(async c => ({ item: await c.getItem() }))
      )
    }))
  );

  const formattedQuiz = {
    name: quiz.name,
    type,
    questions
  };

  return res.json({ formattedQuiz });
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
