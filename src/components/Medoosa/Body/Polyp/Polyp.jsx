import React from 'react';
import { eyes } from '../Mods';
import './Polyp.scss';

const Polyp = ({ modSelections, aura, glowFilter, filterProp }) => {
  const Eyes = eyes[modSelections[1].value];

  return (
    <div className="polyp">
      {aura}
      <div className="polyp__eyes">
        <Eyes />
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
        <title>Polyp</title>
        <defs>{glowFilter}</defs>
        <g data-name="Layer 1">
          <path
            filter={filterProp}
            fill="currentColor"
            stroke="#000"
            strokeMiterlimit="10"
            strokeWidth="10"
            d="M728.8 517.36C664.7 299.07 537.2 305.6 521.56 301.15c-1.32-.38-10.22-1.11-20.93-1.15h-1.26c-10.71 0-19.61.77-20.93 1.15-15.64 4.45-143.14-2.08-207.24 216.21C243.1 613 299 695.42 354.92 698.27c63.24 3.22 116.57 1.16 145.08.13 28.51 1 81.84 3.09 145.07-.13C701 695.42 756.9 613 728.8 517.36z"
          ></path>
        </g>
      </svg>
    </div>
  );
};

export default Polyp;
