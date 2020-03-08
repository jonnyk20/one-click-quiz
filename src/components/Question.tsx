import React, { useState } from "react";
import Image from "./Image";
import { FormattedQuestion } from "../utils/formatQuiz";

import "./Question.scss";
import Button from "./Button";

const states = {
  UNANSWERED: "UNANSWERED",
  CORRECT: "CORRECT",
  INCORRECT: "INCORRECT"
};

type PropTypes = {
  question: FormattedQuestion;
  incrementScore: () => void;
  incrementQuestion: () => void;
};

const Question: React.SFC<PropTypes> = ({
  question,
  incrementScore,
  incrementQuestion
}) => {
  const { choices, correctAnswerIndex } = question;
  const [state, setState] = useState(states.UNANSWERED);
  const answerCorrectly = () => console.log("YES");
  const answerIncorrectly = () => console.log("NO");

  const answerQuestion = (i: number) => {
    if (isAnswered) return;
    if (i === correctAnswerIndex) {
      setState(states.CORRECT);
      answerCorrectly();
      incrementScore();
      return;
    }

    setState(states.INCORRECT);
    answerIncorrectly();
  };

  const moveToNexQuestion = () => {
    incrementQuestion();
    setState(states.UNANSWERED);
  };

  const isAnswered = state !== states.UNANSWERED;
  const isAnsweredCorrectly = state === states.CORRECT;

  const answerFeedback = isAnsweredCorrectly ? "Correct!" : "So Close!";

  return (
    <div className="question">
      <div className="question__image-container">
        {choices.map(({ image_url, name }, i) => (
          <Image
            key={image_url}
            answerQuestion={answerQuestion}
            i={i}
            image_url={image_url}
            name={name}
            isCorrect={i === correctAnswerIndex}
            isAnswered={isAnswered}
          />
        ))}
      </div>
      <div className="question__prompt mv-20">
        {!isAnswered ? (
          <span>
            Find the <b>{choices[correctAnswerIndex].name}</b>
          </span>
        ) : (
          <>
            <span>{answerFeedback}</span>
            <div>
              <Button onClick={moveToNexQuestion}>Next</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Question;
