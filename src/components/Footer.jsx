import React from 'react';
import { Github, Database, Users } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">GDPulse</h3>
            <p className="footer-description">
              Real-time GDP nowcasting using machine learning and high-frequency economic indicators from FRED.
            </p>
            <div className="footer-badges">
              <span className="badge">UTDesign Project</span>
              <span className="badge">Fall 2025</span>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Data Sources</h4>
            <ul className="footer-links">
              <li><Database size={14} /> Federal Reserve Economic Data (FRED)</li>
              <li><Database size={14} /> ~20 Economic Indicators</li>
              <li><Database size={14} /> 2000-2025 Historical Data</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Team</h4>
            <ul className="footer-links">
              <li><Users size={14} /> Ha Jeong</li>
              <li><Users size={14} /> Mateo Estrada</li>
              <li><Users size={14} /> Andrew Nguyen</li>
              <li><Users size={14} /> Camden Byington</li>
              <li><Users size={14} /> Qasim Raza</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Project Info</h4>
            <ul className="footer-links">
              <li>University of Texas at Dallas</li>
              <li>Faculty Advisor: Muhammad Ikram</li>
              <li>Version 1.0 - MVP</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2025 GDPulse Team. Open Source Project.
          </p>
          <div className="footer-links-bottom">
            <a href="#" className="footer-link">
              <Github size={20} />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

