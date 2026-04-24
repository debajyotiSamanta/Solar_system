import React, { useRef, useState, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const Planet = ({ data, globalSpeed, isPaused, planetSpeedMultiplier }) => {
  const meshRef = useRef();
  const groupRef = useRef();
  const coplanetGroupRef = useRef();
  const [hovered, setHover] = useState(false);

  // Constants
  const isSun = data.isSun;
  const coplanetOrbitRadius = data.radius * 2.5;

  // Attempt to load texture safely without crashing if missing (falling back to color)
  const texture = useMemo(() => {
    const textureName = data.name.toLowerCase();
    const loader = new THREE.TextureLoader();
    try {
      // In Vite, assets in public/ are loaded directly via URL
      return loader.load(`/textures/${textureName}.jpg`);
    } catch (e) {
      return null;
    }
  }, [data.name]);

  useFrame((state, delta) => {
    if (isPaused) return;
    
    // Effective speeds
    const curGlobalSpeed = globalSpeed * planetSpeedMultiplier;
    
    // Rotate the planet 
    if (meshRef.current) {
      meshRef.current.rotation.y += data.rotationSpeed * delta * 60 * globalSpeed; 
    }

    // Orbit the planet around the sun
    if (groupRef.current && !isSun) {
      groupRef.current.rotation.y += data.orbitSpeed * delta * 60 * curGlobalSpeed;
    }

    // Orbit coplanet around planet
    if (coplanetGroupRef.current) {
      coplanetGroupRef.current.rotation.y += 0.05 * delta * 60 * curGlobalSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Orbit Ring */}
      {!isSun && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[data.orbitRadius - 0.05, data.orbitRadius + 0.05, 128]} />
          <meshBasicMaterial color="#ffffff" opacity={0.2} transparent side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Planet positioning group */}
      <group position={[isSun ? 0 : data.orbitRadius, 0, 0]}>
        <mesh 
          ref={meshRef}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHover(true);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHover(false);
          }}
        >
          <sphereGeometry args={[data.radius, 32, 32]} />
          <meshPhongMaterial 
            color={texture ? '#ffffff' : data.color} 
            map={texture || null}
            shininess={10} 
            emissive={hovered ? new THREE.Color(0x333333) : new THREE.Color(0x000000)}
          />
          
          {/* Saturn Ring */}
          {data.hasRing && (
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[data.radius * 1.5, data.radius * 2, 64]} />
              <meshPhongMaterial color={0xc0c0c0} side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
          )}

          {/* Sun Glow */}
          {isSun && (
            <pointLight distance={1000} intensity={2} color={data.color} />
          )}
        </mesh>

        {/* Labels Map */}
        <Html distanceFactor={100} zIndexRange={[100, 0]} className="planet-label">
          <div style={{ transform: 'translate3d(50%, -50%, 0)' }}>
            {data.name}
          </div>
        </Html>

        {/* Tooltip on Hover */}
        {hovered && (
          <Html distanceFactor={10} zIndexRange={[200, 0]}>
            <div className="tooltip" style={{ opacity: 1, left: '20px', top: '20px', position: 'absolute' }}>
              {data.name}
            </div>
          </Html>
        )}

        {/* Coplanet (Moon) */}
        {data.coplanetName && (
          <group>
            {/* Coplanet Orbit Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[coplanetOrbitRadius - 0.03, coplanetOrbitRadius + 0.03, 64]} />
              <meshBasicMaterial color="#aaaaaa" side={THREE.DoubleSide} opacity={0.3} transparent />
            </mesh>
            
            {/* Coplanet orbit logic */}
            <group ref={coplanetGroupRef}>
              <mesh position={[coplanetOrbitRadius, 0, 0]}>
                <sphereGeometry args={[data.radius * 0.4, 16, 16]} />
                <meshPhongMaterial color={0xcccccc} shininess={5} />
                <Html distanceFactor={100} className="planet-label" style={{ fontSize: '0.8em', color: '#ccc' }}>
                  <div style={{ transform: 'translate3d(50%, -50%, 0)' }}>
                    {data.coplanetName}
                  </div>
                </Html>
              </mesh>
            </group>
          </group>
        )}

      </group>
    </group>
  );
};

export default Planet;
