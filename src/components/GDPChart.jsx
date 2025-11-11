import React from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart } from 'recharts';
import './GDPChart.css';

const GDPChart = ({ data }) => {
  // If data is empty or doesn't have predictions, show placeholder
  if (!data || data.length === 0) {
    return (
      <div className="gdp-chart-container card">
        <div className="chart-header">
          <h2 className="chart-title">GDP Predictions vs Actual</h2>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No prediction data available. Please check that the backend is running.
        </div>
      </div>
    );
  }

  // Format values to billions for the chart
  const chartData = data.map(item => ({
    ...item,
    predictionBillions: item.prediction / 1000,
    actualBillions: item.actual / 1000,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{data.name}</p>
          <p className="tooltip-value">
            Prediction: ${(data.prediction / 1000).toFixed(2)}B
          </p>
          {data.actual !== null && (
            <p className="tooltip-actual" style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '1rem' }}>
              Actual GDP: ${(data.actual / 1000).toFixed(2)}B
            </p>
          )}
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
        <h2 className="chart-title">GDP Predictions vs Actual</h2>
        <div className="chart-legend-custom">
          <div className="legend-item">
            <div className="legend-dot prediction"></div>
            <span>Prediction</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot actual"></div>
            <span>Actual GDP</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 10, bottom: 60 }}
        >
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
            label={{ value: 'GDP (Billions $)', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
            stroke="var(--text-secondary)"
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Prediction Line */}
          <Line
            type="monotone"
            dataKey="predictionBillions"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: 5 }}
            activeDot={{ r: 7 }}
            name="Prediction"
            isAnimationActive={false}
          />

          {/* Actual GDP Line */}
          <Line
            type="monotone"
            dataKey="actualBillions"
            stroke="#dc2626"
            strokeWidth={4}
            dot={{ fill: '#dc2626', r: 8, strokeWidth: 2, stroke: 'white' }}
            activeDot={{ r: 10, strokeWidth: 2 }}
            name="Actual GDP"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="chart-info">
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
          Comparing predictions from different forecasting horizons against actual GDP values. Blue line shows model predictions, red line shows actual GDP.
        </p>
      </div>
    </div>
  );
};

export default GDPChart;

