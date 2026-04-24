export const PLANET_DATA = [
  { name: 'Sun', radius: 8, color: 0xfdb813, orbitRadius: 0, rotationSpeed: 0.005, orbitSpeed: 0, isSun: true },
  { name: 'Mercury', coplanetName: null, radius: 0.8, color: 0xb5b5b5, orbitRadius: 15, rotationSpeed: 0.004, orbitSpeed: 0.02 },
  { name: 'Venus', coplanetName: null, radius: 1.5, color: 0xe6c229, orbitRadius: 22, rotationSpeed: 0.002, orbitSpeed: 0.015 },
  { name: 'Earth', coplanetName: 'Moon', radius: 1.6, color: 0x6b93d6, orbitRadius: 30, rotationSpeed: 0.01, orbitSpeed: 0.01 },
  { name: 'Mars', coplanetName: 'Phobos', radius: 1.2, color: 0xe27b58, orbitRadius: 38, rotationSpeed: 0.008, orbitSpeed: 0.008 },
  { name: 'Jupiter', coplanetName: 'Io', radius: 4.5, color: 0xe3b07b, orbitRadius: 55, rotationSpeed: 0.025, orbitSpeed: 0.004 },
  { name: 'Saturn', coplanetName: 'Titan', radius: 4, color: 0xf7e3a1, orbitRadius: 75, rotationSpeed: 0.02, orbitSpeed: 0.003, hasRing: true },
  { name: 'Uranus', coplanetName: 'Titania', radius: 3, color: 0x7bc6ee, orbitRadius: 95, rotationSpeed: 0.015, orbitSpeed: 0.002 },
  { name: 'Neptune', coplanetName: 'Triton', radius: 2.8, color: 0x5b5ddf, orbitRadius: 110, rotationSpeed: 0.015, orbitSpeed: 0.001 }
];
