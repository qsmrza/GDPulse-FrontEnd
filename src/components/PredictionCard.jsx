import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './PredictionCard.css';

const PredictionCard = ({ prediction, actualGdp }) => {
  // Calculate trend (actual vs prediction)
  const isPositive = actualGdp >= prediction.prediction;
  const difference = actualGdp - prediction.prediction;
  const percentDifference = ((difference / prediction.prediction) * 100).toFixed(1);

  // Format value to billions (divide thousands by 1000)
  const formatToBillions = (value) => {
    return (value / 1000).toFixed(2);
  };

  // Get model details
  const modelLabels = {
    'nowcasting_h1': { label: 'Nowcast (H1)', description: 'Current Period' },
    'forecasting_h1': { label: 'Forecast (H1)', description: '1 Quarter Ahead' },
    'forecasting_h2': { label: 'Forecast (H2)', description: '2 Quarters Ahead' },
    'forecasting_h3': { label: 'Forecast (H3)', description: '3 Quarters Ahead' },
  };

  const modelInfo = modelLabels[prediction.model_name] || {
    label: prediction.model_name,
    description: 'Prediction'
  };

  return (
    <div className="prediction-card">
      <div className="prediction-header">
        <div className="prediction-label">
          <h3 className="prediction-title">{modelInfo.label}</h3>
          <p className="prediction-description">{modelInfo.description}</p>
        </div>
        <div className={`trend-indicator ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? (
            <TrendingUp size={24} />
          ) : (
            <TrendingDown size={24} />
          )}
          <span className="trend-text">{isPositive ? '+' : ''}{percentDifference}%</span>
        </div>
      </div>

      <div className="prediction-values">
        <div className="value-row">
          <span className="value-label">Prediction</span>
          <span className="value-amount">${formatToBillions(prediction.prediction)}B</span>
        </div>
        <div className="value-row">
          <span className="value-label">Actual GDP</span>
          <span className="value-amount actual">${formatToBillions(actualGdp)}B</span>
        </div>
        <div className="value-row difference">
          <span className="value-label">Difference</span>
          <span className="value-amount">${formatToBillions(Math.abs(difference))}B</span>
        </div>
      </div>

      <div className="prediction-footer">
        <small className="date-text">
          {new Date(prediction.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </small>
        {prediction.cached && <span className="cached-badge">Cached</span>}
      </div>
    </div>
  );
};

export default PredictionCard;
