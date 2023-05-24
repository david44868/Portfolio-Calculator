import React, { useState } from "react";
import "./App.css";
import Form from "./Form.js";
import "./index.css";

function App() {
  const [gradientPosition, setGradientPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const xPos = ((clientX / window.innerWidth) * 100 - 10).toFixed(2); // Subtract 10 from xPos
    const yPos = ((clientY / window.innerHeight) * 100).toFixed(2);
    setGradientPosition({ x: xPos, y: yPos });
  };
  

  return (
    <div className="App" onMouseMove={handleMouseMove}>
      <nav className="navbar">
        <div to="/" className="navbar-logo">
          Portfolio Calculator
          <i class="fab fa-firstdraft" />
        </div>
        <div className="menu-icon">
          <i className={"fas fa-times"} />
        </div>
      </nav>
      <Form />
      <div
        className="background"
        style={{
          background: `linear-gradient(90deg, rgba(24, 136, 255, 0.1) 0%, rgba(24, 136, 255, 0.1) 50%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.5) 100%), radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, #1888ff, #000)`,
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
        }}
      ></div>
    </div>
  );
}

export default App;
