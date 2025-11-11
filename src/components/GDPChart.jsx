import React from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import './GDPChart.css';

const GDPChart = ({ data }) => {
  // If data is empty or doesn't have predictions, show placeholder
  if (!data || data.length === 0) {
    return (
      <div className="gdp-chart-container card">
        <div className="chart-header">
          <h2 className="chart-title">GDP Predictions with Confidence Intervals</h2>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No prediction data available. Please check that the backend is running.
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{data.name}</p>
          <p className="tooltip-value">
            Prediction: {data.prediction?.toFixed(2) || 'N/A'}
          </p>
          {data.actual !== null && (
            <p className="tooltip-actual" style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '1rem' }}>
              Actual GDP: {data.actual?.toFixed(2) || 'N/A'}
            </p>
          )}
          <p className="tooltip-ci" style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
            CI: [{data.lower?.toFixed(2) || 'N/A'}, {data.upper?.toFixed(2) || 'N/A'}]
          </p>
          {data.date && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {new Date(data.date).toLocaleDateString()}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="gdp-chart-container card">
      <div className="chart-header">
        <h2 className="chart-title">GDP Predictions with 95% Confidence Intervals</h2>
        <div className="chart-legend-custom">
          <div className="legend-item">
            <div className="legend-dot prediction"></div>
            <span>Prediction</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot confidence"></div>
            <span>95% CI Band</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot actual"></div>
            <span>Actual GDP</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 60 }}
        >
          <defs>
            <linearGradient id="colorCI" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
            stroke="var(--text-secondary)"
          />
          <YAxis
            label={{ value: 'GDP Value', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
            stroke="var(--text-secondary)"
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Confidence Interval Band */}
          <Area
            type="monotone"
            dataKey="upper"
            stroke="none"
            fill="url(#colorCI)"
            name="Upper CI"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="lower"
            stroke="none"
            fill="white"
            name="Lower CI"
            isAnimationActive={false}
          />

          {/* Prediction Line */}
          <Line
            type="monotone"
            dataKey="prediction"
            stroke="var(--primary-color)"
            strokeWidth={3}
            dot={{ fill: 'var(--primary-color)', r: 5 }}
            activeDot={{ r: 7 }}
            name="Prediction"
          />

          {/* Actual GDP Line */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#dc2626"
            strokeWidth={4}
            dot={{ fill: '#dc2626', r: 8, strokeWidth: 2, stroke: 'white' }}
            activeDot={{ r: 10, strokeWidth: 2 }}
            name="Actual GDP"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="chart-info">
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
          Each model produces predictions for different forecasting horizons: Nowcast (h1) for current period, and forecasts for 1, 2, and 3 quarters ahead.
        </p>
      </div>
    </div>
  );
};

export default GDPChart;

