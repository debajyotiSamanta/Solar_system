# Solar System Simulation

A 3D interactive simulation of our Solar System built with Three.js.

## Features

- ☀️ Sun at the center
- 🪐 8 Planets with realistic relative sizes and orbital distances
- 🌑 Moon orbiting Earth
- 🌌 Background stars
- 🖱️ Interactive camera controls (orbit, zoom, pan)
- 🚀 Orbit paths for all planets
- 🎨 Realistic planet textures

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- [Node.js](https://nodejs.org/) (optional, for running a local server)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd solar_system
   ```

2. Open `index.html` in your web browser:
   ```bash
   # Using a local server (recommended)
   npx serve .
   # Then open http://localhost:3000 in your browser
   
   # Or simply open index.html directly
   open index.html
   ```

## Usage

### Camera Controls

- **Left-click + Drag**: Orbit the camera around the Sun
- **Right-click + Drag**: Pan the camera
- **Scroll wheel**: Zoom in and out

### Keyboard Shortcuts

- **F**: Toggle fullscreen mode
- **Esc**: Exit fullscreen mode

## Project Structure

```
solar_system/
├── index.html              # Main HTML file
├── style.css               # Styles for the simulation
├── script.js               # Main Three.js simulation logic
├── textures/               # Planet texture images
│   ├── sun.jpg
│   ├── mercury.jpg
│   ├── venus.jpg
│   ├── earth.jpg
│   ├── moon.jpg
│   ├── mars.jpg
│   ├── jupiter.jpg
│   ├── saturn.jpg
│   ├── uranus.jpg
│   └── neptune.jpg
└── assets/                 # Additional assets (if any)
```

## Technologies Used

- [Three.js](https://threejs.org/) - 3D graphics library
- [OrbitControls](https://threejs.org/docs/#examples/en/controls/OrbitControls) - Camera controls
- [CSS3DRenderer](https://threejs.org/docs/#examples/en/renderers/CSS3DRenderer) - For HTML overlays
- [GSAP](https://greensock.com/gsap/) - Animation library

## Development

To run this project locally, you can use [npx serve](https://www.npmjs.com/package/serve):

```bash
npm install -g serve
serve .
```

Then open `http://localhost:3000` in your browser.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.