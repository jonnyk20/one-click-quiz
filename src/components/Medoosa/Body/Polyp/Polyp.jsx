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
      <svg
        id="Layer_1"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="200 100 600 600"
      >
        <title>Artboard 25</title>
        <defs>{glowFilter}</defs>
        <path
          d="M654.61,182.91c-28.25,9.8-40.68,55.82-50.85,81.69-14.12,35.95-39.11,31.16-48.23-.63-8.26-28.78-21.18-81.43-50.63-81.06-31.67.4-39.18,58.43-53.67,89.86-11.29,24.51-31.07,24.51-45.24.58-15.76-26.61-19.54-78.71-52.83-83.9-62.93-9.81-48.8,88.22-48.8,88.22L340.28,587c4.85,41.82,35.7,73,72.18,73H594.14c34.64,0,64-29.57,68.69-69.26l37.28-313s0-.07,0-.11C700.65,275.17,719.25,160.47,654.61,182.91Z"
          style={{
            fill: 'currentcolor',
            stroke: '#000',
            strokeMiterlimit: 10,
            strokeWidth: '20px'
          }}
          filter={filterProp}
        />
      </svg>
    </div>
  );
};

export default Polyp;
