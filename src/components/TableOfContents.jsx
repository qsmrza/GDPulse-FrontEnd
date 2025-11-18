import React, { useState, useEffect } from 'react';
import { List } from 'lucide-react';
import './TableOfContents.css';

const sections = [
  { id: 'chart', label: 'GDP Chart' },
  { id: 'indicators', label: 'Economic Indicators' },
  { id: 'model-performance', label: 'Model Performance' }
];

const TableOfContents = () => {
  const [activeSection, setActiveSection] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset for floating elements
      
      // Check which section is currently in view
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }

      // Show TOC after scrolling past hero section
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setIsVisible(window.scrollY > heroBottom - 200);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerOffset = 20;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (!isVisible) return null;

  return (
    <nav className="table-of-contents">
      <div className="toc-header">
        <List size={16} />
        <span>Contents</span>
      </div>
      <ul className="toc-list">
        {sections.map((section) => (
          <li key={section.id}>
            <button
              className={`toc-link ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => scrollToSection(section.id)}
            >
              {section.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;

