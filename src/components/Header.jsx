import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo-section" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <img 
              src="/gdpulse-icon.svg" 
              alt="GDPulse Logo" 
              className="logo-icon-img"
            />
            <div className="logo-text">
              <h1 className="logo-title">GDPulse</h1>
              <p className="logo-subtitle">Real-Time GDP Nowcasting</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

