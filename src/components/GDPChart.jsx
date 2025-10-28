import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import './GDPChart.css';

const GDPChart = ({ data }) => {
  // Separate actual and predicted data
  const actualData = data.filter(d => d.type === 'actual');
  const predictedData = data.filter(d => d.type === 'predicted');
  
  // Combine with the last actual point for smooth transition
  const combinedPredicted = actualData.length > 0 
    ? [actualData[actualData.length - 1], ...predictedData]
    : predictedData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value" style={{ color: payload[0].color }}>
            GDP Growth: {payload[0].value}%
          </p>
          <p className="tooltip-type">
            {payload[0].payload.type === 'actual' ? 'Historical' : 'Predicted'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="gdp-chart-container card">
      <div className="chart-header">
        <h2 className="chart-title">GDP Growth Rate (QoQ Annualized)</h2>
        <div className="chart-legend-custom">
          <div className="legend-item">
            <div className="legend-dot historical"></div>
            <span>Historical</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot predicted"></div>
            <span>Predicted</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart margin={{ top: 20, right: 30, left: 10, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis 
            dataKey="label" 
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
            stroke="var(--text-secondary)"
          />
          <YAxis 
            label={{ value: 'GDP Growth (%)', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
            stroke="var(--text-secondary)"
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="var(--text-secondary)" strokeDasharray="3 3" />
          
          <Line 
            data={actualData}
            type="monotone" 
            dataKey="gdp" 
            stroke="var(--primary-color)" 
            strokeWidth={3}
            dot={{ fill: 'var(--primary-color)', r: 4 }}
            activeDot={{ r: 6 }}
            name="Actual GDP"
          />
          
          <Line 
            data={combinedPredicted}
            type="monotone" 
            dataKey="gdp" 
            stroke="var(--warning-color)" 
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ fill: 'var(--warning-color)', r: 4 }}
            activeDot={{ r: 6 }}
            name="Predicted GDP"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GDPChart;

