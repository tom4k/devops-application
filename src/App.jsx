import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="app-container">
      <div className={`hero-content ${isVisible ? 'fade-in' : ''}`}>
        <div className="badge">🚀 Future Ready</div>
        <h1 className="title">
          Containerized <br />
          <span className="gradient-text">DevOps Pipeline</span>
        </h1>
        <p className="subtitle">
          Built with React, Docker, and Jenkins. Deployed with precision and speed.
        </p>
        
        <div className="button-group">
          <button className="btn primary-btn">
            Get Started
            <span className="arrow">→</span>
          </button>
          <button className="btn secondary-btn">View Documentation</button>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="icon">⚛️</div>
            <h3>React Frontend</h3>
            <p>Lightning fast UI built with Vite and React</p>
          </div>
          <div className="feature-card">
            <div className="icon">🐳</div>
            <h3>Dockerized</h3>
            <p>Multi-stage builds for optimal image size</p>
          </div>
          <div className="feature-card">
            <div className="icon">⚙️</div>
            <h3>CI/CD Pipeline</h3>
            <p>Automated building and testing with Jenkins</p>
          </div>
        </div>
      </div>
      
      <div className="background-decorations">
        <div className="glow-orb purple"></div>
        <div className="glow-orb blue"></div>
      </div>
    </div>
  );
}

export default App;
