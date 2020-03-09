import React from "react";
import "./ProgressBar.scss";
import classNames from "classnames";

const ProgressBar = ({
  progress,
  transparent = false
}: {
  progress: number;
  transparent?: boolean;
}) => {
  const baseClass = "progress-bar";

  const className = classNames(baseClass, {
    [`${baseClass}--transparent`]: transparent
  });

  return (
    <div>
      <div className={className}>
        <div
          className="progress-bar__filler"
          style={{ width: `${Math.trunc(progress * 100)}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
