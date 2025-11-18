import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FloatingLogo.css';

const FloatingLogo = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="floating-logo" onClick={handleLogoClick}>
      <img 
        src="/gdpulse-icon.svg" 
        alt="GDPulse Logo" 
        className="floating-logo-img"
      />
    </div>
  );
};

export default FloatingLogo;

