import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import './IndicatorsGrid.css';

const IndicatorsGrid = ({ indicators }) => {
  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'high':
        return 'importance-high';
      case 'medium':
        return 'importance-medium';
      case 'low':
        return 'importance-low';
      default:
        return '';
    }
  };

  return (
    <div className="indicators-section">
      <div className="section-header">
        <h2 className="section-title">Economic Indicators</h2>
        <p className="section-subtitle">
          Real-time data from Federal Reserve Economic Data (FRED)
        </p>
      </div>

      <div className="indicators-grid grid grid-3">
        {indicators.map((indicator) => {
          const isPositive = indicator.change > 0;
          const changeClass = isPositive ? 'positive' : 'negative';
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;

          return (
            <div key={indicator.id} className="indicator-card card">
              <div className="indicator-header">
                <div className="indicator-name-section">
                  <h3 className="indicator-name">{indicator.name}</h3>
                  <span className={`indicator-importance ${getImportanceColor(indicator.importance)}`}>
                    {indicator.importance}
                  </span>
                </div>
                <span className="indicator-id">{indicator.id}</span>
              </div>

              <div className="indicator-value-section">
                <div className="indicator-value">
                  <span className="value-number">{indicator.value}</span>
                  <span className="value-unit">{indicator.unit}</span>
                </div>

                <div className={`indicator-change ${changeClass}`}>
                  <TrendIcon size={16} />
                  <span>{indicator.change > 0 ? '+' : ''}{indicator.change}%</span>
                </div>
              </div>

              <p className="indicator-description">{indicator.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IndicatorsGrid;

