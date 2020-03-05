import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Builder from "./components/Builder";
import Quiz from "./Quiz";

const App = () => (
  <Router>
    <Switch>
      <Route path="/quiz/:slug">
        <Quiz />
      </Route>
      <Route path="/">
        <Builder />
      </Route>
    </Switch>
  </Router>
);

export default App;
