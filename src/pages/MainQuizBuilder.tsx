import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { uniq } from "ramda";
import { isNotNilOrEmpty } from "../utils/utils";
import ProgressIndicator, {
  BuilderProgress
} from "../components/ProgressIndicator";
import Button from "../components/Button";
import { BuilderState } from "../constants/states";

import "./MainQuizBuilder.scss";
import { Link } from "react-router-dom";

const convertItemsToInput = (arr: string[]): string => arr.join("\n");
const convertInputToItems = (input: string): string[] =>
  input.split("\n").slice(0, 40);

const defaultItems = ["jade", "amethyst", "topaz", "sapphire", "turquoise"];

type CompletedQuizPayload = {
  url: string;
};

const Builder = () => {
  const [items, setItems] = useState<string[]>(defaultItems);
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [quizUrl, setQuizUrl] = useState<string>("my-quiz");
  const [progress, setProgress] = useState<BuilderProgress>({
    completed: 0,
    total: 0
  });
  const [builderState, setBuilderState] = useState<BuilderState>(
    BuilderState.INPUTTING
  );

  const validItems = items.filter(isNotNilOrEmpty);

  const handleChange = (event: any) => {
    setItems(convertInputToItems(event.target.value));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    socket?.emit("submit-quiz", uniq(validItems));
    setBuilderState(BuilderState.PREPARING);
  };

  const handleComplete = (payload: CompletedQuizPayload) => {
    setQuizUrl(payload.url);
    setBuilderState(BuilderState.READY);
  };

  useEffect(() => {
    const socket = socketIOClient({ reconnectionAttempts: 0 });
    socket.on(
      "main-quiz-builder-progress-update",
      (progress: BuilderProgress) => {
        console.log("progress update received", progress);
        setProgress(progress);
      }
    );
    socket.on("completed", (payload: CompletedQuizPayload) => {
      console.log("Quiz comleted", payload);
      handleComplete(payload);
    });
    socket.on("update", (update: any) => console.log("UPDATE", update));
    setSocket(socket);
  }, []);

  const isInputting = builderState === BuilderState.INPUTTING;
  const isPreparing = builderState === BuilderState.PREPARING;
  const isComplete = builderState === BuilderState.READY;
  const formattedQuizUrl = `${window.location.origin}/quiz/${quizUrl}`;
  const inputValue = convertItemsToInput(items);

  return (
    <div className="main-quiz-builder container">
      <div className="main-quiz-builder__examples">
        <Link to="/taxa-challenge">Wildlife Quiz</Link>
        <Link to="/upcoming-features">Project Info</Link>
      </div>
      <div>
        <h1>1 Click Quiz</h1>
        <p className="text-medium">Create an image quiz on anything you want</p>
        <p className="text-medium">
          Then test yourself and share it with others for free
        </p>
      </div>
      {isInputting && (
        <div className="main-quiz-builder__form">
          <div className="main-quiz-builder__form__submit-button mb-20">
            <Button onClick={handleSubmit}>Create Quiz</Button>
          </div>
          <textarea
            className="main-quiz-builder__form__input"
            value={inputValue}
            onChange={handleChange}
          />
          <div className="main-quiz-builder__form__preview">
            {validItems.map((item, i) => (
              <div
                key={item}
                className="main-quiz-builder__form__preview__item"
              >
                {`${i + 1}. ${item}`}
              </div>
            ))}
          </div>
        </div>
      )}
      {isPreparing && <ProgressIndicator {...progress} />}
      {isComplete && (
        <div>
          Your Quiz is ready at
          <br />
          <div className="main-quiz-builder__quiz-link">
            <a href={formattedQuizUrl} target="_blank">
              {formattedQuizUrl}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Builder;
