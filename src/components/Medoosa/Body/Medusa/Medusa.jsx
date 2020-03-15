import React from 'react';
import { eyes, mouth, arms } from '../Mods';
import './Medusa.scss';

const Medusa = ({ modSelections, aura, glowFilter, filterProp }) => {
  const Eyes = eyes[modSelections[1].value];
  const Mouth = mouth[modSelections[2].value];
  const Arms = arms[modSelections[3].value];

  return (
    <div className="medusa">
      {aura}
      <div className="medusa__eyes">
        <Eyes />
      </div>
      <div className="medusa__mouth">
        <Mouth />
      </div>
      <div className="medusa__arms">
        <Arms />
      </div>
      <div className="medusa__frame">
        <svg
          id="Layer_1"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 1000"
        >
          <title>Artboard 16</title>
          <defs>{glowFilter}</defs>
          <path
            fill="currentColor"
            stroke="#000"
            strokeMiterlimit="10"
            strokeWidth="20"
            d="M760.85 517.36C687.78 299.07 542.41 305.6 524.58 301.15c-1.51-.38-11.66-1.11-23.86-1.15h-1.44c-12.2 0-22.35.77-23.86 1.15-17.83 4.45-163.2-2.08-236.27 216.21-32 95.68 31.72 178.06 95.45 180.91 72.09 3.22 132.89 1.16 165.4.13 32.51 1 93.31 3.09 165.4-.13 63.73-2.85 127.48-85.27 95.45-180.91z"
            data-name="Layer 1"
          ></path>
          a194.23,194.23,0,0,1,133.56,53.38A204.92,204.92,0,0,1,715.66,445.6c7,83,22.85,162.88,24.18,169.48a20.84,20.84,0,0,1-.51,8C736.43,633,726.7,640,715.66,640H284.34c-11.89,0-21.07-9.49-23.67-18.41a20.85,20.85,0,0,1-.49-8.15c.89-5.24,14.33-85.18,21.45-170.13a202.15,202.15,0,0,1,62.54-130.59A191.78,191.78,0,0,1,476.08,260h42.65m0-10H476.08c-106.63,0-195.29,83.69-204.41,192.47C264.28,530.5,250.28,612,250.28,612a30.9,30.9,0,0,0,.79,12.37c4,13.87,17.45,25.62,33.27,25.62H715.66c15.82,0,29.23-10.26,33.27-24.12a30.91,30.91,0,0,0,.79-12.37S733,531.37,725.62,444.76C716.31,334.67,626.64,250,518.73,250Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default Medusa;
