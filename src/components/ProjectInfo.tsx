import React from 'react';
import { Link } from 'react-router-dom';

const ProjectInfo = () => (
  <div className="project-info text-small">
    <p>
      Built by <a href="https://twitter.com/jonnykalambay">Jonny Kalambay</a>
    </p>
    <p>
      The <Link to="/taxa-challenge">nature quiz</Link> on this site uses data
      from&nbsp;
      <a href="https://www.inaturalist.org/">iNaturalist</a>
    </p>
    <p>
      Thank you&nbsp;
      <a href="https://twitter.com/natbat">Natalie Downe</a> and&nbsp;
      <a href="https://twitter.com/simonw">Simon Willison</a> for building&nbsp;
      <a href="https://www.owlsnearme.com/">owlsnearme.com</a>, from which
      the&nbsp;project was inspired
    </p>
    <p>
      You can find my code &nbsp;
      <a href="https://github.com/jonnyk20/one-click-quiz">here</a>
    </p>
  </div>
);

export default ProjectInfo;
