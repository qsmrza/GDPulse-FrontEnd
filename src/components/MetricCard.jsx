import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './MetricCard.css';

const MetricCard = ({ title, value, unit, change, subtitle, icon: Icon }) => {
  const isPositive = change > 0;
  const changeClass = isPositive ? 'positive' : 'negative';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="metric-card card">
      <div className="metric-header">
        <div className="metric-icon-wrapper">
          {Icon && <Icon className="metric-icon" size={24} />}
        </div>
        <h3 className="metric-title">{title}</h3>
      </div>
      
      <div className="metric-value-section">
        <div className="metric-main-value">
          <span className="metric-value">{value}</span>
          <span className="metric-unit">{unit}</span>
        </div>
        
        <div className={`metric-change ${changeClass}`}>
          <TrendIcon size={16} />
          <span>{Math.abs(change).toFixed(1)}%</span>
        </div>
      </div>
      
      {subtitle && <p className="metric-subtitle">{subtitle}</p>}
    </div>
  );
};

export default MetricCard;

