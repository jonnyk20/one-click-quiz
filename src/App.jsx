import React from "react";

import logo from "./logo.svg";
import "./App.css";

const callApi = async () => {
  const response = await fetch("/ping");
  const body = await response.json();
  if (response.status !== 200) throw Error(body.message);
  console.log("BODY", body);
};

const App = () => {
  return (
    <div>
      <button onClick={callApi}> HA</button>
    </div>
  );
};

export default App;
