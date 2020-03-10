import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { isEmpty } from "ramda";
import Question from "../components/Question";
import formatQuiz, { FormattedQuiz } from "../utils/formatQuiz";
import { isNilOrEmpty, encodeQueryString } from "../utils/utils";
import testQuiz from "../utils/testQuiz";
import { QUIZ_TYPES, QUIZ_TAGS } from "../constants/quizProperties";

import "./Quiz.scss";
import Button from "../components/Button";

const fetchQuiz = async (slug: string) => {
  const response = await fetch(`${window.location.origin}/api/quiz/${slug}`);
  const json = await response.json();

  return json;
};

interface State {
  quiz: FormattedQuiz;
  user: string;
}

type Location = {
  state: State;
};

const Quiz = () => {
  const { slug = "" } = useParams();
  const [quiz, setQuiz] = useState<FormattedQuiz>({
    name: "",
    quizType: QUIZ_TYPES.IMAGE_QUIZ,
    questions: [],
    tags: []
  });
  const [correctAnswers, setCorrectAnswerrs] = useState<number>(0);
  const [maxCorrectAnswers, setmaxCorrectAnswers] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const location: Location = useLocation();
  const user = location?.state?.user || "";

  const isTesting = slug === "testing";

  useEffect(() => {
    const prepareQuiz = async () => {
      const data = await fetchQuiz(slug);
      if (data?.quiz?.id) {
        const formattedQuiz = formatQuiz(data.quiz);
        setQuiz(formattedQuiz);
        setmaxCorrectAnswers(formattedQuiz.questions.length);
      }
    };

    if (!isNilOrEmpty(location?.state?.quiz)) {
      const { quiz } = location.state;
      setQuiz(quiz);
      setmaxCorrectAnswers(quiz.questions.length);
      return;
    }

    if (isTesting) {
      setQuiz(testQuiz);
      setmaxCorrectAnswers(testQuiz.questions.length);
      return;
    }

    if (!isEmpty(slug)) {
      prepareQuiz();
    }
  }, [location, slug]);

  const incrementCorrectAnswers = () => setCorrectAnswerrs(correctAnswers + 1);
  const incrementScore = (addedScore: number) => setScore(score + addedScore);

  const incrementQuestion = () => {
    if (currentQuestionIndex < quiz!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      return;
    }
    setIsFinished(true);
  };

  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const isMyObservationQuiz = quiz.tags.includes(QUIZ_TAGS.MY_OBSERVATIONS);
  const isTaxaChallengeQuiz = quiz.tags.includes(QUIZ_TAGS.TAXA_CHALLENGE);

  return (
    <div className="quiz container">
      {!isNilOrEmpty(quiz.questions) && !isFinished && (
        <Question
          correctAnswers={correctAnswers}
          maxCorrectAnswers={maxCorrectAnswers}
          score={score}
          question={currentQuestion}
          incrementCorrectAnswers={incrementCorrectAnswers}
          incrementScore={incrementScore}
          incrementQuestion={incrementQuestion}
        />
      )}
      {isFinished && (
        <div className="quiz__results">
          <div className="mv-20">
            Correct:&nbsp;
            <span className="text-light-color">{`${correctAnswers}/${maxCorrectAnswers}`}</span>
            <span>&nbsp;-&nbsp;Score:&nbsp;</span>
            <span className="text-light-color">{score}</span>
            <div>
              {isMyObservationQuiz && !isNilOrEmpty(user) && (
                <>
                  <div className="mv-20 text-medium">
                    Try again with more of your observations
                  </div>
                  <Button onClick={() => {}}>
                    <Link
                      className="text-link text-medium"
                      to={{
                        pathname: "/my-observations",
                        search: encodeQueryString({ user })
                      }}
                    >
                      My Observations
                    </Link>
                  </Button>
                  <div className="mv-20"> OR</div>
                  <div className="mv-20 text-medium">
                    Test how well you know your local wildlife
                  </div>
                  <Button onClick={() => {}}>
                    <Link
                      className="text-link text-medium"
                      to="/taxa-challenge"
                    >
                      Taxa Challenge
                    </Link>
                  </Button>
                </>
              )}
              {isTaxaChallengeQuiz && (
                <>
                  <div className="mv-20 text-medium">
                    Try again and we'll show you different animals!
                  </div>
                  <Button onClick={() => {}}>
                    <Link
                      to="/taxa-challenge"
                      className="text-link text-medium"
                    >
                      Let's go
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
