import React, { useState } from "react";

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
    convertArrayToString(["Tiger", "Leopard", "Cheetah"])
  );
  const [inputValue, setInputValue] = useState(items);

  const handleChange = event => {
    setInputValue(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    createQuiz(inputValue);
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
