import React, { forwardRef } from 'react';
import { colors } from './Mods/colors';
import Aura from './Aura/Aura';
import Egg from './Egg/Egg';
import Planula from './Planula/Planula';
import Polyp from './Polyp/Polyp';
import Ephyra from './Ephyra/Ephyra';
import Medusa from './Medusa/Medusa';
import FinalForm from './FinalForm/FinalForm';
import GlowFilter from './GlowFilter';
import './Body.scss';

const bodies = [Egg, Planula, Polyp, Ephyra, Medusa, FinalForm];

const BodyComponent: React.SFC<any> = forwardRef(
  (
    { stage = 0, modSelections, isLevelUpPending, onClick = () => {} },
    ref: React.Ref<HTMLDivElement>
  ) => {
    const Body = bodies[stage];
    const color = colors[modSelections[0].value];
    const aura = isLevelUpPending ? <Aura /> : null;
    const glowFilter = isLevelUpPending ? <GlowFilter /> : null;
    const filterProp = glowFilter ? 'url(#sofGlow)' : '';

    return (
      <div
        className={`body ${isLevelUpPending ? 'body--clickable' : ''}`}
        style={{ color }}
        ref={ref}
        onClick={onClick}
      >
        <Body
          modSelections={modSelections}
          aura={aura}
          glowFilter={glowFilter}
          filterProp={filterProp}
        />
      </div>
    );
  }
);

export default BodyComponent;
