import React from "react";
import classNames from "classnames";

const labelBaseClass = "image__label";

const Image = ({
  i,
  image_url,
  answerQuestion,
  isAnswered,
  isCorrect,
  name
}) => {
  const className = classNames(labelBaseClass, {
    [`${labelBaseClass}--${isCorrect ? "correct" : "incorrect"}`]: isAnswered
  });

  return (
    <div className="image" onClick={() => answerQuestion(i)}>
      <img key={image_url} src={image_url} />
      <div className={className}>{isAnswered && isCorrect && name}</div>
    </div>
  );
};

export default Image;
