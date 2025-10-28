import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Award, Target, TrendingUp } from 'lucide-react';
import './ModelMetrics.css';

const ModelMetrics = ({ metrics, featureImportance }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].payload.feature}</p>
          <p className="tooltip-value">
            Importance: {(payload[0].value * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="model-metrics-section">
      <h2 className="section-title">Model Performance</h2>
      
      <div className="metrics-cards grid grid-3">
        <div className="metric-card-small card">
          <div className="metric-small-header">
            <Award className="metric-small-icon" size={20} />
            <span className="metric-small-label">R² Score</span>
          </div>
          <div className="metric-small-value">{metrics.rSquared.toFixed(2)}</div>
          <div className="metric-small-subtitle">Model Accuracy</div>
        </div>

        <div className="metric-card-small card">
          <div className="metric-small-header">
            <Target className="metric-small-icon" size={20} />
            <span className="metric-small-label">RMSE</span>
          </div>
          <div className="metric-small-value">{metrics.rmse.toFixed(2)}</div>
          <div className="metric-small-subtitle">Root Mean Square Error</div>
        </div>

        <div className="metric-card-small card">
          <div className="metric-small-header">
            <TrendingUp className="metric-small-icon" size={20} />
            <span className="metric-small-label">MAE</span>
          </div>
          <div className="metric-small-value">{metrics.mae.toFixed(2)}</div>
          <div className="metric-small-subtitle">Mean Absolute Error</div>
        </div>
      </div>

      <div className="feature-importance-section card">
        <h3 className="chart-title">Feature Importance</h3>
        <p className="chart-subtitle">
          Top economic indicators contributing to GDP predictions
        </p>
        
        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
            data={featureImportance} 
            layout="vertical"
            margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis 
              type="number" 
              tick={{ fontSize: 12 }}
              stroke="var(--text-secondary)"
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <YAxis 
              type="category" 
              dataKey="feature" 
              tick={{ fontSize: 12 }}
              stroke="var(--text-secondary)"
              width={140}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="importance" radius={[0, 8, 8, 0]}>
              {featureImportance.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`hsl(${220 - index * 15}, 70%, 55%)`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="model-info">
          <div className="model-info-item">
            <span className="info-label">Algorithm:</span>
            <span className="info-value">{metrics.algorithm}</span>
          </div>
          <div className="model-info-item">
            <span className="info-label">Training Data:</span>
            <span className="info-value">{metrics.trainingDataPoints} quarters</span>
          </div>
          <div className="model-info-item">
            <span className="info-label">Last Trained:</span>
            <span className="info-value">{metrics.lastTrainingDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelMetrics;

