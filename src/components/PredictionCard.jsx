import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './PredictionCard.css';

const PredictionCard = ({ prediction, actualGdp }) => {
  // Since these are future predictions, we don't show trend comparison
  // Just display the prediction value
  const predictionInBillions = prediction.prediction / 1000;

  // Format value to billions (divide thousands by 1000)
  const formatToBillions = (value) => {
    return (value / 1000).toFixed(2);
  };

  // Calculate forecast date based on model type
  const getDateLabel = () => {
    const baseDate = new Date(prediction.date);

    switch(prediction.model_name) {
      case 'nowcasting_h1':
        return `Nowcast (Today)`;
      case 'forecasting_h1':
        const h1Date = new Date(baseDate);
        h1Date.setDate(h1Date.getDate() + 90);
        return `H1: ${h1Date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
      case 'forecasting_h2':
        const h2Date = new Date(baseDate);
        h2Date.setDate(h2Date.getDate() + 180);
        return `H2: ${h2Date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
      case 'forecasting_h3':
        const h3Date = new Date(baseDate);
        h3Date.setDate(h3Date.getDate() + 270);
        return `H3: ${h3Date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
      default:
        return prediction.date;
    }
  };

  // Get model details
  const modelLabels = {
    'nowcasting_h1': { label: 'Nowcast', description: 'Current Period' },
    'forecasting_h1': { label: 'Forecast H1', description: '1 Quarter Ahead' },
    'forecasting_h2': { label: 'Forecast H2', description: '2 Quarters Ahead' },
    'forecasting_h3': { label: 'Forecast H3', description: '3 Quarters Ahead' },
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
        <div className="prediction-icon">
          <span className="forecast-badge">Forecast</span>
        </div>
      </div>

      <div className="prediction-values">
        <div className="value-row primary">
          <span className="value-label">Predicted GDP</span>
          <span className="value-amount">${formatToBillions(prediction.prediction)}B</span>
        </div>
      </div>

      <div className="prediction-footer">
        <small className="date-text">
          {getDateLabel()}
        </small>
        {prediction.cached && <span className="cached-badge">Cached</span>}
      </div>
    </div>
  );
};

export default PredictionCard;
