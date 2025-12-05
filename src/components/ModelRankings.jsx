import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, Award, Target } from 'lucide-react';
import './ModelRankings.css';

const ModelRankings = ({ models, modelType }) => {
  if (!models || models.length === 0) {
    return null;
  }

  // Get medal color for top 3 models
  const getMedalColor = (index) => {
    switch (index) {
      case 0: return '#FFD700'; // Gold
      case 1: return '#C0C0C0'; // Silver
      case 2: return '#CD7F32'; // Bronze
      default: return '#6b7280';
    }
  };

  // Get rank icon
  const getRankIcon = (index) => {
    if (index === 0) return <Trophy size={20} style={{ color: getMedalColor(0) }} />;
    if (index === 1) return <Award size={20} style={{ color: getMedalColor(1) }} />;
    if (index === 2) return <Target size={20} style={{ color: getMedalColor(2) }} />;
    return <span style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>#{index + 1}</span>;
  };

  // Prepare data for R² chart
  const r2ChartData = models.map((model, index) => ({
    name: model.model_name,
    r2: model.test_r2,
    fill: getMedalColor(index)
  }));

  // Prepare data for Error Metrics chart
  const errorChartData = models.map((model, index) => ({
    name: model.model_name,
    rmse: model.test_rmse,
    mae: model.test_mae,
    fill: getMedalColor(index)
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#333' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: '4px 0', fontSize: '14px', color: entry.color }}>
              <strong>{entry.name}:</strong> {entry.value !== null ? entry.value.toFixed(3) : 'N/A'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="model-rankings-section">
      <h2 className="section-title">Model Performance Rankings</h2>

      {/* Rankings Table */}
      <div className="rankings-table-wrapper card">
        <div className="table-header">
          <div className="header-cell">Rank</div>
          <div className="header-cell">Model</div>
          <div className="header-cell">R² Score</div>
          <div className="header-cell">RMSE</div>
          <div className="header-cell">MAE</div>
          <div className="header-cell">Coverage</div>
        </div>
        {models.map((model, index) => (
          <div key={index} className={`table-row ${index < 3 ? 'top-performer' : ''}`}>
            <div className="table-cell rank-cell">
              {getRankIcon(index)}
            </div>
            <div className="table-cell model-cell">
              <span className="model-name">{model.model_name}</span>
            </div>
            <div className="table-cell metric-cell">
              <span className={model.test_r2 > 0 ? 'metric-positive' : 'metric-negative'}>
                {model.test_r2 !== null ? model.test_r2.toFixed(3) : 'N/A'}
              </span>
            </div>
            <div className="table-cell metric-cell">
              {model.test_rmse !== null ? model.test_rmse.toFixed(3) : 'N/A'}
            </div>
            <div className="table-cell metric-cell">
              {model.test_mae !== null ? model.test_mae.toFixed(3) : 'N/A'}
            </div>
            <div className="table-cell metric-cell">
              {model.coverage_95 !== null && model.coverage_95 !== undefined
                ? `${model.coverage_95.toFixed(1)}%`
                : '-'}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* R² Score Chart */}
        <div className="chart-card card">
          <h3 className="chart-title">R² Score Comparison</h3>
          <p className="chart-subtitle">Higher is better (measures model accuracy)</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={r2ChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                style={{ fontSize: '11px' }}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis
                style={{ fontSize: '12px' }}
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="r2" radius={[8, 8, 0, 0]}>
                {r2ChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Error Metrics Chart */}
        <div className="chart-card card">
          <h3 className="chart-title">Error Metrics Comparison</h3>
          <p className="chart-subtitle">Lower is better (RMSE & MAE)</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={errorChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                style={{ fontSize: '11px' }}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis
                style={{ fontSize: '12px' }}
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="rmse" fill="#ef4444" radius={[8, 8, 0, 0]} name="RMSE" />
              {errorChartData[0].mae !== null && (
                <Bar dataKey="mae" fill="#f59e0b" radius={[8, 8, 0, 0]} name="MAE" />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ensemble Weights (if available) */}
      {models.find(m => m.model_name === 'Ensemble' && m.weights) && (
        <div className="ensemble-weights card">
          <h3 className="chart-title">Ensemble Model Weights</h3>
          <p className="chart-subtitle">Contribution of each model to the ensemble prediction</p>
          <div className="weights-grid">
            {Object.entries(models.find(m => m.model_name === 'Ensemble').weights).map(([modelName, weight], index) => (
              <div key={index} className="weight-item">
                <div className="weight-bar-container">
                  <div
                    className="weight-bar"
                    style={{
                      width: `${(weight * 100).toFixed(1)}%`,
                      backgroundColor: getMedalColor(index)
                    }}
                  />
                </div>
                <div className="weight-label">
                  <span className="weight-model-name">{modelName}</span>
                  <span className="weight-value">{(weight * 100).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelRankings;
