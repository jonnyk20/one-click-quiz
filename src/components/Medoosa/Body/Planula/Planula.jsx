import React from 'react';

import './Planula.scss';

const Planula = ({ aura, glowFilter, filterProp }) => (
  <div className="planula">
    {aura}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
      <title>Planula</title>
      <defs>{glowFilter}</defs>
      <g data-name="Layer 1">
        <circle
          cx="500"
          cy="500"
          r="175"
          fill="currentColor"
          stroke="#000"
          strokeMiterlimit="10"
          strokeWidth="15"
          filter={filterProp}
        ></circle>
        <circle cx="429.5" cy="485.5" r="38.5" filter={filterProp}></circle>
        <circle
          cx="422.5"
          cy="479.5"
          r="12"
          fill="#fff"
          filter={filterProp}
        ></circle>
        <circle cx="572.5" cy="485.5" r="38.5" filter={filterProp}></circle>
        <circle
          cx="560"
          cy="479"
          r="12"
          fill="#fff"
          filter={filterProp}
        ></circle>
      </g>
    </svg>
  </div>
);

export default Planula;
