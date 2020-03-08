import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Builder from "./pages/MainQuizBuilder";
import Quiz from "./pages/Quiz";
import TaxaChallenge from "./pages/TaxaChallenge";

const App = () => (
  <Router>
    <Switch>
      <Route path="/quiz/:slug">
        <Quiz />
      </Route>
      <Route path="/taxa-challenge">
        <TaxaChallenge />
      </Route>
      <Route path="/">
        <Builder />
      </Route>
    </Switch>
  </Router>
);

export default App;
