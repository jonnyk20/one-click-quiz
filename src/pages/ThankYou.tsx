import React from "react";
import Button from "../components/Button";
import { Link } from "react-router-dom";

import "./ThankYou.scss";

const ThankYou = () => (
  <div className="thank-you container">
    <h1>Thank You!</h1>
    <div>You'll be first to hear about new features</div>
    <div className="mv-50">
      <Button onClick={() => {}}>
        <Link to="/" className="text-link">
          Return Home
        </Link>
      </Button>
    </div>
  </div>
);

export default ThankYou;
