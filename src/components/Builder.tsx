import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import wait from "../utils/wait";
import ProgressIndicator, { BuilderProgress } from "./ProgressIndicator";
import { BuilderState } from "../constants/states";
import "./Builder.scss";

const convertArrayToString = (arr: string[]) => arr.join("\n");
type CompletedQuizPayload = {
  url: string;
};

const Builder = () => {
  const [items, setItems] = useState(
    convertArrayToString(["Tiger", "Leopard", "Cheetah", "Koala"])
  );
  const [inputValue, setInputValue] = useState<string>(items);
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [quizUrl, setQuizUrl] = useState<string>("my-quiz");
  const [progress, setProgress] = useState<BuilderProgress>({
    completed: 0,
    total: 0
  });
  const [builderState, setBuilderState] = useState(BuilderState.INPUTTING);

  const handleChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    socket?.emit("submit-quiz", inputValue);
    setBuilderState(BuilderState.PREPARING);
    await wait(10000);
  };

  const handleComplete = (payload: CompletedQuizPayload) => {
    setQuizUrl(payload.url);
    setBuilderState(BuilderState.READY);
  };

  useEffect(() => {
    const socket = socketIOClient();
    socket.on("builder-progress-update", (progress: BuilderProgress) => {
      console.log("progross update received", progress);
      setProgress(progress);
    });
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

  return (
    <div className="builder">
      <div className="builder__title">
        <h1>1 Click Quiz</h1>
      </div>
      {isInputting && (
        <form onSubmit={handleSubmit}>
          <textarea value={inputValue} onChange={handleChange} />
          <br />
          <button type="submit">Create Quiz</button>
        </form>
      )}
      {isPreparing && <ProgressIndicator {...progress} />}
      {isComplete && (
        <div>
          Your Quiz is ready at
          <br />
          <div className="builder__quiz-link">
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
