import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Builder from "./Builder";
import Quiz from "./Quiz";

import "./App.scss";

const App = () => (
  <Router>
    <Switch>
      <Route path="/quiz/:id">
        <Quiz />
      </Route>
      <Route path="/">
        <Builder />
      </Route>
    </Switch>
  </Router>
);

export default App;
