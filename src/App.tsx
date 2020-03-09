import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ReactGA from "react-ga";
import Builder from "./pages/MainQuizBuilder";
import Quiz from "./pages/Quiz";
import TaxaChallenge from "./pages/TaxaChallenge";
import MyObservations from "./pages/MyObservations";

ReactGA.initialize("UA-33174971-5");
ReactGA.pageview(window.location.pathname + window.location.search);

const App = () => (
  <Router>
    <div className="app">
      <div className="appp__bg-overlay"></div>
      <Switch>
        <Route path="/quiz/:slug">
          <Quiz />
        </Route>
        <Route path="/taxa-challenge">
          <TaxaChallenge />
        </Route>
        <Route path="/my-observations">
          <MyObservations />
        </Route>
        <Route path="/">
          <Builder />
        </Route>
      </Switch>
    </div>
  </Router>
);

export default App;
