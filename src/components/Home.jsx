import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const G7_COUNTRIES = [
    { name: 'United States', code: 'US' },
    { name: 'Canada', code: 'CA' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'Italy', code: 'IT' },
    { name: 'Japan', code: 'JP' }
  ];

  const handleCountryClick = (countryCode) => {
    navigate(`/dashboard/${countryCode}`);
  };

  return (
    <div className="home">
      <div className="home-container">
        <div className="home-hero">
          <div className="home-logo-section">
            <img 
              src="/gdpulse-icon.svg" 
              alt="GDPulse Logo" 
              className="home-logo"
            />
            <h1 className="home-title">GDPulse</h1>
          </div>
          
          <p className="home-description">
            GDPulse is a real-time GDP nowcasting platform that uses machine learning 
            and high-frequency economic indicators to provide accurate GDP predictions 
            for G7 countries. Our platform leverages advanced algorithms and data from 
            the Federal Reserve Economic Data (FRED) to deliver timely economic insights 
            and forecasts.
          </p>
        </div>

        <div className="countries-section">
          <h2 className="countries-title">Select a Country</h2>
          <p className="countries-subtitle">Choose a G7 country to view its GDP dashboard</p>
          
          <div className="countries-grid">
            {G7_COUNTRIES.map((country) => (
              <button
                key={country.code}
                className="country-button"
                onClick={() => handleCountryClick(country.code)}
              >
                <span className="country-name">{country.name}</span>
                <Activity className="country-icon" size={20} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

