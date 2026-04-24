import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import SolarSystem from './components/SolarSystem';
import HUD from './components/HUD';
import { PLANET_DATA } from './utils/constants';

function App() {
  const [globalSpeed, setGlobalSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [planetSpeeds, setPlanetSpeeds] = useState(
    PLANET_DATA.reduce((acc, planet) => {
      acc[planet.name] = 1; // Speed multiplier per planet
      return acc;
    }, {})
  );

  const handlePlanetSpeedChange = (name, speed) => {
    setPlanetSpeeds(prev => ({ ...prev, [name]: speed }));
  };

  return (
    <div className="container">
      <div id="scene-container">
        <Canvas camera={{ position: [0, 20, 100], fov: 60 }}>
          <color attach="background" args={['#050505']} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1} color="#ffffff" />
          
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <SolarSystem 
            globalSpeed={globalSpeed} 
            isPaused={isPaused} 
            planetSpeeds={planetSpeeds} 
          />
          
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true}
            minDistance={5}
            maxDistance={500}
            makeDefault
          />
        </Canvas>
      </div>

      <HUD 
        isPaused={isPaused} 
        setIsPaused={setIsPaused}
        globalSpeed={globalSpeed}
        setGlobalSpeed={setGlobalSpeed}
        planetSpeeds={planetSpeeds}
        handlePlanetSpeedChange={handlePlanetSpeedChange}
      />
    </div>
  );
}

export default App;
