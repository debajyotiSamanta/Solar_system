document.addEventListener('DOMContentLoaded', () => {
    // --- Theme toggle logic  ---
    const themeToggleInput = document.getElementById('theme');
    // Set initial theme to dark
    // Theme toggle logic: only change theme when user clicks the toggle, and do not trigger on unrelated button clicks
    // Fix: Only listen for 'change' event on the checkbox input, not 'click', and do not use a <label> that wraps other controls/buttons
    function setThemeFromToggle(e) {
        // Only respond to direct user interaction with the toggle input (not bubbled events)
        if (e && e.target === themeToggleInput) {
            const dark = themeToggleInput.checked;
            document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        }
    }
    themeToggleInput.addEventListener('change', setThemeFromToggle);
    // Set initial state
    themeToggleInput.checked = true;
    document.documentElement.setAttribute('data-theme', 'dark');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('scene-container').appendChild(renderer.domElement);
    // Camera position
    camera.position.z = 50;
    // Orbit controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    // Fix for zoom: enableZoom is true by default, but mouse buttons may be mapped incorrectly for zoom on some builds.
    // Explicitly set mouse buttons for OrbitControls (right = pan, middle = zoom, left = rotate)
    controls.enableZoom = true;
    controls.minDistance = 1;
    controls.maxDistance = 2000;
    if (controls.mouseButtons) {
        controls.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN
        };
    }
    if (controls.touches) {
        controls.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
        };
    }
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);   
    // Add stars background
    addStars();   
    // Clock for animations
    const clock = new THREE.Clock();   
    // Solar system parameters
    const planets = [
        { name: 'Sun', radius: 5, color: 0xfdb813, orbitRadius: 0, rotationSpeed: 0.005, orbitSpeed: 0 },
        { name: 'Mercury', coplanetName: '', radius: 0.8, color: 0xb5b5b5, orbitRadius: 10, rotationSpeed: 0.004, orbitSpeed: 0.02 },
        { name: 'Venus', coplanetName: '', radius: 1.5, color: 0xe6c229, orbitRadius: 15, rotationSpeed: 0.002, orbitSpeed: 0.015 },
        { name: 'Earth', coplanetName: 'Moon', radius: 1.6, color: 0x6b93d6, orbitRadius: 20, rotationSpeed: 0.01, orbitSpeed: 0.01 },
        { name: 'Mars', coplanetName: 'Phobos', radius: 1.2, color: 0xe27b58, orbitRadius: 25, rotationSpeed: 0.008, orbitSpeed: 0.008 },
        { name: 'Jupiter', coplanetName: 'Io', radius: 3.5, color: 0xe3b07b, orbitRadius: 35, rotationSpeed: 0.025, orbitSpeed: 0.004 },
        { name: 'Saturn', coplanetName: 'Titan', radius: 3, color: 0xf7e3a1, orbitRadius: 45, rotationSpeed: 0.02, orbitSpeed: 0.003, hasRing: true },
        { name: 'Uranus', coplanetName: 'Titania', radius: 2.5, color: 0x7bc6ee, orbitRadius: 55, rotationSpeed: 0.015, orbitSpeed: 0.002 },
        { name: 'Neptune', coplanetName: 'Triton', radius: 2.3, color: 0x5b5ddf, orbitRadius: 65, rotationSpeed: 0.015, orbitSpeed: 0.001 }
    ];   
    // Create solar system
    const solarSystem = new THREE.Group();
    scene.add(solarSystem);    
    // Store planet objects for animation
    const planetObjects = [];    
    // Create planets
    planets.forEach((planet, index) => {
        // --- Add planet name label ---
        const planetNameDiv = document.createElement('div');
        planetNameDiv.className = 'planet-label';
        planetNameDiv.textContent = planet.name;
        planetNameDiv.style.position = 'absolute';
        planetNameDiv.style.color = '#fff';
        planetNameDiv.style.fontWeight = 'bold';
        planetNameDiv.style.pointerEvents = 'none';
        planetNameDiv.style.textShadow = '0 0 4px #000, 0 0 8px #000';
        document.body.appendChild(planetNameDiv);

        const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
        const material = new THREE.MeshPhongMaterial({ 
            color: planet.color,
            shininess: 10
        });
        const planetMesh = new THREE.Mesh(geometry, material);
        if (planet.name === 'Sun') {
            planetMesh.userData.labelDiv = planetNameDiv;
            // Sun is at the center
            solarSystem.add(planetMesh);
            // Add sun glow
            const sunGlow = new THREE.PointLight(0xfdb813, 1, 100);
            sunGlow.position.set(0, 0, 0);
            scene.add(sunGlow);
            // Special: Place the Sun label beside the Sun (right side, vertically centered)
            function updateSunLabelPosition() {
                const sunPos = new THREE.Vector3();
                planetMesh.getWorldPosition(sunPos);
                sunPos.project(camera);
                // Place label to the right of the sun, offset by sun radius in screen space
                const x = (sunPos.x * 0.5 + 0.5) * window.innerWidth;
                const y = (-(sunPos.y * 0.5) + 0.5) * window.innerHeight;
                // Offset by sun radius (projected to screen)
                // Estimate: offset by 1.2 * sun radius in pixels
                const sunScreenRadius = (camera.position.z / (camera.position.z - sunPos.z)) * planet.radius * renderer.getSize(new THREE.Vector2()).y / camera.getFocalLength();
                planetNameDiv.style.left = `${x + 40}px`;
                planetNameDiv.style.top = `${y - 10}px`;
                planetNameDiv.style.display = '';
            }
            // Attach to animation loop
            if (!window._updateSunLabelFns) window._updateSunLabelFns = [];
            window._updateSunLabelFns.push(updateSunLabelPosition);
        } else {
            // Create orbit path (for planet's revolution around the Sun)
            const orbit = new THREE.Group();
            orbit.rotation.x = Math.PI / 4; // Tilt the orbit slightly for better visualization
            solarSystem.add(orbit);
            // Draw visible orbit ring
            const orbitRingGeometry = new THREE.RingGeometry(planet.orbitRadius - 0.05, planet.orbitRadius + 0.05, 128);
            const orbitRingMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, opacity: 0.2, transparent: true });
            const orbitRing = new THREE.Mesh(orbitRingGeometry, orbitRingMaterial);
            orbitRing.rotation.x = Math.PI / 2;
            orbit.add(orbitRing);
            // Position planet on orbit
            const planetOrbit = new THREE.Group();
            planetOrbit.position.x = planet.orbitRadius;
            orbit.add(planetOrbit);
            planetOrbit.add(planetMesh);
        // --- Add coplanet (moon) only if it has a name ---
        let coplanetNameDiv = null;
        let coplanetGroup = null;
        let coplanetMesh = null;
        if (planet.coplanetName && planet.coplanetName.trim() !== '') {
            coplanetNameDiv = document.createElement('div');
            coplanetNameDiv.className = 'planet-label';
            coplanetNameDiv.textContent = planet.coplanetName;
            coplanetNameDiv.style.position = 'absolute';
            coplanetNameDiv.style.color = '#ccc';
            coplanetNameDiv.style.fontWeight = 'bold';
            coplanetNameDiv.style.pointerEvents = 'none';
            coplanetNameDiv.style.fontSize = '0.9em';
            coplanetNameDiv.style.textShadow = '0 0 4px #000, 0 0 8px #000';
            document.body.appendChild(coplanetNameDiv);
            // --- Add coplanet (moon) ---
            const coplanetOrbitRadius = planet.radius * 2.5;
            coplanetGroup = new THREE.Group();
            coplanetGroup.position.set(0, 0, 0); // Centered on planet
            planetMesh.add(coplanetGroup);
            // Draw visible orbit ring for coplanet
            const coplanetOrbitRingGeometry = new THREE.RingGeometry(coplanetOrbitRadius - 0.03, coplanetOrbitRadius + 0.03, 64);
            const coplanetOrbitRingMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide, opacity: 0.3, transparent: true });
            const coplanetOrbitRing = new THREE.Mesh(coplanetOrbitRingGeometry, coplanetOrbitRingMaterial);
            coplanetOrbitRing.rotation.x = Math.PI / 2;
            coplanetGroup.add(coplanetOrbitRing);
            // Coplanet (moon) mesh
            const coplanetGeometry = new THREE.SphereGeometry(planet.radius * 0.4, 16, 16);
            const coplanetMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc, shininess: 5 });
            coplanetMesh = new THREE.Mesh(coplanetGeometry, coplanetMaterial);
            coplanetMesh.position.x = coplanetOrbitRadius;
            coplanetGroup.add(coplanetMesh);
        }
            // Add ring for Saturn
            if (planet.hasRing) {
                const ringGeometry = new THREE.RingGeometry(planet.radius * 1.5, planet.radius * 2, 32);
                const ringMaterial = new THREE.MeshPhongMaterial({
                    color: 0xc0c0c0,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.8
                });
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.rotation.x = Math.PI / 2;
                planetMesh.add(ring);
            }
            // Store planet info for animation
            planetObjects.push({
                mesh: planetMesh,
                orbit: orbit,
                planetOrbit: planetOrbit,
                rotationSpeed: planet.rotationSpeed,
                orbitSpeed: planet.orbitSpeed,
                name: planet.name,
                color: planet.color,
                labelDiv: planetNameDiv,
                coplanet: coplanetGroup && coplanetMesh && coplanetNameDiv ? {
                    group: coplanetGroup,
                    mesh: coplanetMesh,
                    orbitSpeed: 0.04 + 0.01 * Math.random(), // Each coplanet gets a slightly different speed
                    labelDiv: coplanetNameDiv
                } : null
            });
        }
    });   
    // Create controls UI
    createControlsUI();   
    // Animation state
    let isPaused = false;
    let globalSpeed = 1;   
    // Animation loop
    function animate() {
        // --- Update label positions ---
        planetObjects.forEach(planet => {
            // Project planet position to 2D screen
            const planetPos = new THREE.Vector3();
            planet.mesh.getWorldPosition(planetPos);
            planetPos.project(camera);
            const x = (planetPos.x * 0.5 + 0.5) * window.innerWidth;
            const y = (-(planetPos.y * 0.5) + 0.5) * window.innerHeight;
            if (planet.labelDiv) {
                // For Sun, skip here (handled separately)
                if (planet.name !== 'Sun') {
                    planet.labelDiv.style.left = `${x}px`;
                    planet.labelDiv.style.top = `${y}px`;
                    planet.labelDiv.style.display = '';
                }
            }
            // Coplanet label
            if (planet.coplanet && planet.coplanet.labelDiv) {
                const coplanetPos = new THREE.Vector3();
                planet.coplanet.mesh.getWorldPosition(coplanetPos);
                coplanetPos.project(camera);
                const cx = (coplanetPos.x * 0.5 + 0.5) * window.innerWidth;
                const cy = (-(coplanetPos.y * 0.5) + 0.5) * window.innerHeight;
                planet.coplanet.labelDiv.style.left = `${cx}px`;
                planet.coplanet.labelDiv.style.top = `${cy}px`;
                planet.coplanet.labelDiv.style.display = '';
            }
        });
        // Update Sun label position (beside the sun)
        if (window._updateSunLabelFns) {
            window._updateSunLabelFns.forEach(fn => fn());
        }
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        if (!isPaused) {
            // Animate planets and coplanets
            planetObjects.forEach(planet => {
                // Planet rotation
                planet.mesh.rotation.y += planet.rotationSpeed * delta * globalSpeed;
                // Orbit rotation (planet around Sun)
                planet.orbit.rotation.y += planet.orbitSpeed * delta * globalSpeed;
                // Coplanet (moon) orbiting planet
                if (planet.coplanet) {
                    planet.coplanet.group.rotation.y += planet.coplanet.orbitSpeed * delta * globalSpeed;
                }
            });
        }
        controls.update();
        renderer.render(scene, camera);
    }   
    animate();   
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });    
    // Function for adding stars background
    function addStars() {
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,
            transparent: true
        });       
        const starsVertices = [];
        for (let i = 0; i < 1000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starsVertices.push(x, y, z);
        }       
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(stars);
    }    
    function createControlsUI() {
        const controlsPanel = document.querySelector('.controls-panel');
        const planetControlsContainer = document.querySelector('.planet-controls');
        const pauseResumeBtn = document.getElementById('pause-resume');
        const globalSpeedInput = document.getElementById('global-speed');
        const globalSpeedValue = document.getElementById('global-speed-value');
        const controlsToggle = document.querySelector('.controls-toggle');        
        // Toggle controls panel
        controlsToggle.addEventListener('click', () => {
            controlsPanel.classList.toggle('visible');
            controlsToggle.textContent = controlsPanel.classList.contains('visible') ? '✕ Close' : '☰ Controls';
        });        
        // Pause/resume button
        pauseResumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            isPaused = !isPaused;
            pauseResumeBtn.textContent = isPaused ? 'Resume' : 'Pause';
        });
        // Global speed control
        globalSpeedInput.addEventListener('input', (e) => {
            globalSpeed = parseFloat(e.target.value);
            globalSpeedValue.textContent = `${globalSpeed.toFixed(1)}x`;
        });        
        // --- Add separate zoom in/out buttons ---
        const zoomControls = document.createElement('div');
        zoomControls.className = 'zoom-controls';
        zoomControls.style.display = 'flex';
        zoomControls.style.gap = '10px';
        zoomControls.style.margin = '16px 0';
        zoomControls.innerHTML = `
            <button id="zoom-in" style="font-size:1.2em;padding:4px 16px;">＋ Zoom In</button>
            <button id="zoom-out" style="font-size:1.2em;padding:4px 16px;">－ Zoom Out</button>
        `;
        controlsPanel.insertBefore(zoomControls, planetControlsContainer);

        document.getElementById('zoom-in').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Move camera closer to controls.target
            const dir = new THREE.Vector3();
            dir.subVectors(camera.position, controls.target).normalize();
            const newPos = camera.position.clone().addScaledVector(dir, -10); // move 10 units closer
            // Clamp to minDistance
            if (newPos.distanceTo(controls.target) >= controls.minDistance) {
                camera.position.copy(newPos);
                camera.updateProjectionMatrix();
            }
        });
        document.getElementById('zoom-out').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Move camera farther from controls.target
            const dir = new THREE.Vector3();
            dir.subVectors(camera.position, controls.target).normalize();
            const newPos = camera.position.clone().addScaledVector(dir, 10); // move 10 units farther
            // Clamp to maxDistance
            if (newPos.distanceTo(controls.target) <= controls.maxDistance) {
                camera.position.copy(newPos);
                camera.updateProjectionMatrix();
            }
        });

        // Create planet controls
        planetObjects.forEach(planet => {
            const planetControl = document.createElement('div');
            planetControl.className = 'planet-control';           
            const planetId = planet.name.toLowerCase().replace(/\s+/g, '-');            
            planetControl.innerHTML = `
                <div class="planet-control-header">
                    <div class="planet-color" style="background-color: #${planet.color.toString(16).padStart(6, '0')}"></div>
                    <h3>${planet.name}</h3>
                </div>
                <div class="speed-control">
                    <label for="${planetId}-speed">Orbit Speed:</label>
                    <input type="range" id="${planetId}-speed" min="0" max="2" step="0.1" value="1">
                    <span id="${planetId}-speed-value">1x</span>
                </div>
            `;            
            planetControlsContainer.appendChild(planetControl);            
            // Add event listener for planet speed control
            const speedInput = document.getElementById(`${planetId}-speed`);
            const speedValue = document.getElementById(`${planetId}-speed-value`);            
            speedInput.addEventListener('input', (e) => {
                const speed = parseFloat(e.target.value);
                planet.orbitSpeed = planets.find(p => p.name === planet.name).orbitSpeed * speed;
                speedValue.textContent = `${speed.toFixed(1)}x`;
            });
        });
        // Add tooltip functionality
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        document.body.appendChild(tooltip);        
        // Raycaster for planet hover detection
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();        
        window.addEventListener('mousemove', (event) => {
            // Calculate mouse position in normalized device coordinates
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;            
            // Update the raycaster
            raycaster.setFromCamera(mouse, camera);            
            // Calculate objects intersecting the picking ray
            const intersects = raycaster.intersectObjects(
                planetObjects.map(p => p.mesh).concat(planetObjects.filter(p => p.hasRing).map(p => p.ring))
            );            
            if (intersects.length > 0) {
                const planetMesh = intersects[0].object;
                const planet = planetObjects.find(p => p.mesh === planetMesh || p.ring === planetMesh);                
                if (planet) {
                    tooltip.textContent = planet.name;
                    tooltip.style.left = `${event.clientX + 10}px`;
                    tooltip.style.top = `${event.clientY + 10}px`;
                    tooltip.style.opacity = '1';                    
                    // Highlight planet
                    planetMesh.material.emissive = new THREE.Color(0x333333);
                    planetMesh.material.needsUpdate = true;
                }
            } else {
                tooltip.style.opacity = '0';                
                // Reset all planet highlights
                planetObjects.forEach(p => {
                    p.mesh.material.emissive = new THREE.Color(0x000000);
                    p.mesh.material.needsUpdate = true;
                });
            }
        });
    }
});
