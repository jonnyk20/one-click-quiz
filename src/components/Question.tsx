import React, { useState } from "react";
import Image from "./Image";

const states = {
  UNANSWERED: "UNANSWERED",
  CORRECT: "CORRECT",
  INCORRECT: "INCORRECT"
};

type Choice = {
  image_url: string;
  name: string;
};

type PropTypes = {
  question: {
    choices: Choice[];
    correctAnswerIndex: number;
  };
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
      <div className="question__prompt">
        {!isAnswered ? (
          `Find the ${choices[correctAnswerIndex].name}`
        ) : (
          <>
            {answerFeedback}
            <button onClick={moveToNexQuestion}>Next</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Question;
