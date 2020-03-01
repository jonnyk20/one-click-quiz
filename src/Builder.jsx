import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const convertArrayToString = arr => arr.join("\n");

const createQuiz = async items => {
  const formData = new FormData();

  formData.append("items", items);

  const response = await fetch("quiz/create/", {
    method: "POST",
    body: formData
  });
  const json = await response.json();

  return json;
};

const Builder = () => {
  const [items, setItems] = useState(
    convertArrayToString(["Tiger", "Leopard", "Cheetah", "Koala"])
  );
  const [inputValue, setInputValue] = useState(items);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = socketIOClient();
    socket.on("update", msg => {
      console.log("update received", msg);
      socket.emit("boom", { hello: "world" });
    });
    socket.on("completed", msg => {
      console.log("quiz completed", msg);
    });
    setSocket(socket);
  }, []);

  const handleChange = event => {
    setInputValue(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    socket.emit("submit-quiz", inputValue);
  };

  return (
    <div className="app">
      <h1>1 Click Quiz</h1>
      <form onSubmit={handleSubmit}>
        <textarea value={inputValue} onChange={handleChange} />
        <br />
        <button type="submit">Create Quiz</button>
      </form>
    </div>
  );
};

export default Builder;
