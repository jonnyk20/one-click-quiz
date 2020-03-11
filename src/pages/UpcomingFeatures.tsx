import React from "react";
import MailingListSignup from "../components/MailingListSignup";

import "./UpcomingFeatures.scss";
import ProjectInfo from "../components/ProjectInfo";
import { Link } from "react-router-dom";

const EMAIL_SUBJECT = encodeURI("1 Click Quiz - Feedback and Feature Requests");

const UpcomingFeatures = () => (
  <div className="upcoming-features container">
    <h2 className="text-light-color">More Features Coming Soon...</h2>
    <ul className="upcoming-features__feature-list">
      <li className="upcoming-features__feature-list__feature">
        Sentence quizzes for language learning
      </li>
      <li className="upcoming-features__feature-list__feature">
        More options and filters for animal quizzes
      </li>
      <li className="upcoming-features__feature-list__feature">
        Public scoreboards
      </li>
      <li className="upcoming-features__feature-list__feature">
        And more, based on&nbsp;
        <a
          className="text-light-color"
          href={`mailto:jonnyk_78@hotmail.com?subject=${EMAIL_SUBJECT}`}
          target="_blank"
        >
          your feedback
        </a>
      </li>
    </ul>
    <h3 className="mv-50 text-center text-light-color">
      Leave your email to be the first to know!
    </h3>
    <MailingListSignup />
    <div className="mt-50">
      <Link to="/">Home</Link>
    </div>
    <div className="mt-50">
      <ProjectInfo />
    </div>
  </div>
);

export default UpcomingFeatures;
