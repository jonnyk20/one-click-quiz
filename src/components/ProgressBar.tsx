import React from "react";
import "./ProgressBar.scss";

const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div>
      <div className="progress-bar">
        <div
          className="progress-bar__filler"
          style={{ width: `${Math.trunc(progress * 100)}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
