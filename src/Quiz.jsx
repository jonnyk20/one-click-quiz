import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Question from "./components/Question";
import formatQuiz from "./utils/formatQuiz";

const fetchQuiz = async id => {
  const response = await fetch(`${window.location.origin}/api/quiz/${id}`);
  const json = await response.json();

  return json;
};

const Quiz = () => {
  const { slug } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const prepareQuiz = async () => {
      const data = await fetchQuiz(slug);

      if (data?.quiz?.id) {
        const formattedQuiz = formatQuiz(data.quiz);
        setQuiz(formattedQuiz);
        setMaxScore(formattedQuiz.questions.length);
      }
    };
    prepareQuiz();
  }, [slug]);

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
