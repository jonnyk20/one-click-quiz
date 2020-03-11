import React from "react";
import { Link } from "react-router-dom";

const ProjectInfo = () => (
  <div className="project-info text-x-small">
    <p>
      Built by <a href="https://twitter.com/jonnykalambay">Jonny Kalambay</a>
      &nbsp;using data from&nbsp;
      <a href="https://www.inaturalist.org/">iNaturalist</a>
    </p>
    <p>
      Thank you&nbsp;
      <a href="https://twitter.com/natbat">Natalie Downe</a> and&nbsp;
      <a href="https://twitter.com/simonw">Simon Willison</a> for building&nbsp;
      <a href="https://www.owlsnearme.com/">owlsnearme.com</a>, from which
      this&nbsp;project was inspired
    </p>
  </div>
);

export default ProjectInfo;
