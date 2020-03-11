import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link, useHistory } from "react-router-dom";
import { isEmpty } from "ramda";
import Question from "../components/Question";
import formatQuiz, { FormattedQuiz } from "../utils/formatQuiz";
import { isNilOrEmpty, encodeQueryString } from "../utils/utils";
import testQuiz from "../utils/testQuiz";
import { QUIZ_TYPES, QUIZ_TAGS } from "../constants/quizProperties";

import "./Quiz.scss";
import MoreFeaturesCTA from "../components/MoreFeaturesCTA";
import ProjectInfo from "../components/ProjectInfo";

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
  const history = useHistory();

  const isTesting = slug === "testing";

  useEffect(() => {
    const prepareQuiz = async () => {
      const data = await fetchQuiz(slug);
      if (data?.quiz?.id) {
        const formattedQuiz = formatQuiz(data.quiz);
        setQuiz(formattedQuiz);
        setmaxCorrectAnswers(formattedQuiz.questions.length);
      } else {
        history.push("/");
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
  const isInaturalistQuiz = isMyObservationQuiz || isTaxaChallengeQuiz;

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
                <div className="mv-50">
                  <Link
                    className="text-medium text-underline mb-10 mt-20 text-white text-underline flex"
                    to={{
                      pathname: "/my-observations",
                      search: encodeQueryString({ user })
                    }}
                  >
                    Try again with more of your observations
                  </Link>
                  <div className="mt-5 text-medium">-OR-</div>

                  <Link
                    className="text-medium text-underline mv-5 text-white text-underline flex"
                    to="/taxa-challenge"
                  >
                    Test how well you know your local wildlife
                  </Link>
                </div>
              )}
              {isTaxaChallengeQuiz && (
                <div className="mv-50">
                  <Link
                    to="/taxa-challenge"
                    className="text-medium text-white mv-20 flex"
                  >
                    Try again and we'll show you different animals!
                  </Link>
                  <div className="mv-20 text-medium">OR</div>
                  <div className="mv-20 text-medium">
                    <div>
                      Are you an{" "}
                      <a
                        href="https://www.inaturalist.org/"
                        className="text-white"
                      >
                        iNaturalist
                      </a>
                      &nbsp;user?
                    </div>
                  </div>
                  <Link
                    to="/my-observations"
                    className="text-medium text-white flex"
                  >
                    Quiz yourself on the animals you've found!
                  </Link>
                </div>
              )}
              <div className="mv-50">
                <MoreFeaturesCTA />
              </div>
              <div className="mt-50 text-medium">
                <Link to="/">Home</Link>
              </div>
              {isInaturalistQuiz && <ProjectInfo />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
