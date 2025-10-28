import React from 'react';
import { Activity } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo-section">
            <Activity className="logo-icon" size={32} />
            <div className="logo-text">
              <h1 className="logo-title">GDPulse</h1>
              <p className="logo-subtitle">Real-Time GDP Nowcasting</p>
            </div>
          </div>
          
          <nav className="nav">
            <button className="nav-link active">Dashboard</button>
            <button className="nav-link">Indicators</button>
            <button className="nav-link">About</button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

