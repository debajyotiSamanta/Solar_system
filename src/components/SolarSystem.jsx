import React from 'react';
import Planet from './Planet';
import { PLANET_DATA } from '../utils/constants';

const SolarSystem = ({ globalSpeed, isPaused, planetSpeeds }) => {
  return (
    <group rotation={[Math.PI / 8, 0, 0]}>
      {PLANET_DATA.map((planet) => (
        <Planet 
          key={planet.name} 
          data={planet} 
          globalSpeed={globalSpeed}
          isPaused={isPaused}
          planetSpeedMultiplier={planetSpeeds[planet.name] || 1}
        />
      ))}
    </group>
  );
};

export default SolarSystem;
