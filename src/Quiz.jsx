import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Question from "./Question";

const fetchQuiz = async id => {
  const response = await fetch(`${window.location.origin}/api/quiz/${id}`);
  const json = await response.json();

  return json;
};

const Quiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const prepareQuiz = async () => {
      const data = await fetchQuiz(id);
      console.log("DATA", data);
      setQuiz(data.quiz);
      setMaxScore(data.quiz.questions.length);
    };
    prepareQuiz();
  }, [id]);

  const incrementScore = () => setScore(score + 1);
  const incrementQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      return;
    }
    setIsFinished(true);
  };

  return (
    <div className="container">
      <div className="quiz">
        <div>{`Score: ${score}/${maxScore}`}</div>
        {!!quiz.questions && !isFinished && (
          <Question
            question={quiz.questions[currentQuestion]}
            incrementScore={incrementScore}
            incrementQuestion={incrementQuestion}
          />
        )}
        {isFinished && <div>Done</div>}
      </div>
    </div>
  );
};

export default Quiz;
