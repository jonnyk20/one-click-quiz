import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ReactGA from 'react-ga';
import Builder from './pages/MainQuizBuilder';
import Quiz from './pages/Quiz';
import TaxaChallenge from './pages/TaxaChallenge';
import MyObservations from './pages/MyObservations';
import ThankYou from './pages/ThankYou';
import UpcomingFeatures from './pages/UpcomingFeatures';
import MarineLifeQuiz from './pages/MarineLifeQuiz';
import MedoosaTest from './pages/MedoosaTest';
import FinishScreen from './pages/FinishScreen';
import TaxaQuiz from './pages/TaxaQuiz';
import NatureQuizHome from './pages/NatureQuizHome';
import Sandbox from './pages/Sandbox';
import ErrorBoundary from './components/ErrorBoundary';

ReactGA.initialize('UA-33174971-5');
ReactGA.pageview(window.location.pathname + window.location.search);

export const TEST_ID = 'app';

const App = () => (
  <Router>
    <div className="app" data-testid={TEST_ID}>
      <ErrorBoundary>
        <div className="appp__bg-overlay"></div>
        <Switch>
          <Route path="/quiz/:slug">
            <Quiz />
          </Route>
          <Route path="/medoosa">
            <MedoosaTest />
          </Route>
          <Route path="/sandbox">
            <Sandbox />
          </Route>
          <Route path="/taxa-challenge">
            <TaxaChallenge />
          </Route>
          <Route path="/nature-quiz">
            <NatureQuizHome />
          </Route>
          <Route path="/taxa-quiz">
            <TaxaQuiz />
          </Route>
          <Route path="/finish">
            <FinishScreen />
          </Route>
          <Route path="/marine-life">
            <MarineLifeQuiz />
          </Route>
          <Route path="/my-observations">
            <MyObservations />
          </Route>
          <Route path="/upcoming-features">
            <UpcomingFeatures />
          </Route>
          <Route path="/thank-you">
            <ThankYou />
          </Route>
          <Route path="/">
            <Builder />
          </Route>
        </Switch>
      </ErrorBoundary>
    </div>
  </Router>
);

export default App;
