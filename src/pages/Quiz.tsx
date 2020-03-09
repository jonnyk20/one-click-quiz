import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { isEmpty } from "ramda";
import Question from "../components/Question";
import formatQuiz, { FormattedQuiz } from "../utils/formatQuiz";
import { isNilOrEmpty } from "../utils/utils";

import "./Quiz.scss";

const fetchQuiz = async (slug: string) => {
  const response = await fetch(`${window.location.origin}/api/quiz/${slug}`);
  const json = await response.json();

  return json;
};

interface State {
  quiz: FormattedQuiz;
}

type Location = {
  state: State;
};

const Quiz = () => {
  const { slug = "" } = useParams();
  const [quiz, setQuiz] = useState<FormattedQuiz>({
    name: "",
    quizType: "",
    questions: []
  });
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState(false);
  const location: Location = useLocation();

  useEffect(() => {
    const prepareQuiz = async () => {
      const data = await fetchQuiz(slug);
      if (data?.quiz?.id) {
        const formattedQuiz = formatQuiz(data.quiz);
        setQuiz(formattedQuiz);
        setMaxScore(formattedQuiz.questions.length);
      }
    };

    if (!isNilOrEmpty(location?.state?.quiz)) {
      const { quiz } = location.state;
      setQuiz(quiz);
      setMaxScore(quiz.questions.length);
      return;
    }

    if (!isEmpty(slug)) {
      prepareQuiz();
    }
  }, [slug]);

  const incrementScore = () => setScore(score + 1);
  const incrementQuestion = () => {
    if (currentQuestionIndex < quiz!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      return;
    }
    setIsFinished(true);
  };

  const currentQuestion = quiz?.questions[currentQuestionIndex];

  return (
    <div className="quiz container">
      <div className="mv-20">{`Score: ${score}/${maxScore}`}</div>
      {!isNilOrEmpty(quiz.questions) && !isFinished && (
        <Question
          question={currentQuestion}
          incrementScore={incrementScore}
          incrementQuestion={incrementQuestion}
        />
      )}
      {isFinished && <div>Done</div>}
    </div>
  );
};

export default Quiz;
