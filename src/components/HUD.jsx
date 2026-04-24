import React, { useState } from 'react';
import { PLANET_DATA } from '../utils/constants';

const HUD = ({ isPaused, setIsPaused, globalSpeed, setGlobalSpeed, planetSpeeds, handlePlanetSpeedChange }) => {
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <>
      <header>
        <h1>3D Solar System</h1>
        <div className="controls-toggle" onClick={() => setPanelOpen(!panelOpen)}>
          {panelOpen ? '✕ Close' : '☰ Controls'}
        </div>
      </header>

      <div className={`controls-panel ${panelOpen ? 'visible' : ''}`}>
        <div className="global-controls">
          <button onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <div className="speed-control">
            <label>Global Speed:</label>
            <input 
              type="range" 
              min="0" max="2" step="0.1" 
              value={globalSpeed} 
              onChange={(e) => setGlobalSpeed(parseFloat(e.target.value))}
            />
            <span>{globalSpeed.toFixed(1)}x</span>
          </div>
        </div>

        <div className="planet-controls">
          {PLANET_DATA.filter(p => !p.isSun).map((planet) => (
            <div className="planet-control" key={planet.name}>
              <div className="planet-control-header">
                <div 
                  className="planet-color" 
                  style={{ backgroundColor: `#${planet.color.toString(16).padStart(6, '0')}` }}
                />
                <h3>{planet.name}</h3>
              </div>
              <div className="speed-control">
                <label>Orbit Speed:</label>
                <input 
                  type="range" 
                  min="0" max="2" step="0.1" 
                  value={planetSpeeds[planet.name]} 
                  onChange={(e) => handlePlanetSpeedChange(planet.name, parseFloat(e.target.value))}
                />
                <span>{planetSpeeds[planet.name].toFixed(1)}x</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HUD;
