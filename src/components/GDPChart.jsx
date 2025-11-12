import React from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  ReferenceLine,
} from "recharts";
import "./GDPChart.css";

const GDPChart = ({ data }) => {
  // If data is empty or doesn't have predictions, show placeholder
  if (!data || data.length === 0) {
    return (
      <div className="gdp-chart-container card">
        <div className="chart-header">
          <h2 className="chart-title">GDP Predictions vs Historical Data</h2>
        </div>
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            color: "var(--text-secondary)",
          }}
        >
          No prediction data available. Please check that the backend is
          running.
        </div>
      </div>
    );
  }

  // Find the current quarter marker (today/now line) - last historical data point
  const historicalData = data.filter(
    (item) => item.isHistorical && item.actual !== undefined,
  );
  const currentQuarterDate =
    historicalData.length > 0
      ? historicalData[historicalData.length - 1].date
      : null;
  const currentQuarterDisplay =
    historicalData.length > 0
      ? historicalData[historicalData.length - 1].displayDate
      : null;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">
            {item.displayDate || item.modelName || "Data Point"}
          </p>
          {item.actual !== undefined && (
            <p
              className="tooltip-actual"
              style={{ color: "#dc2626", fontWeight: "bold" }}
            >
              Real GDP: ${item.actual.toFixed(2)}B
            </p>
          )}
          {item.prediction !== undefined && (
            <p className="tooltip-value">
              Predicted GDP: ${item.prediction.toFixed(2)}B
            </p>
          )}
          {item.date && (
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                marginTop: "0.25rem",
              }}
            >
              {new Date(item.date).toLocaleDateString()}
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
        <h2 className="chart-title">GDP Predictions vs Historical Data</h2>
        <div className="chart-legend-custom">
          <div className="legend-item">
            <div className="legend-dot actual"></div>
            <span>Real GDP (Past 4 Quarters)</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot nowcasting"></div>
            <span>Nowcasting Predictions (Past)</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot prediction"></div>
            <span>Model Predictions (Future)</span>
          </div>
          <div
            className="legend-item"
            style={{ borderLeft: "3px dashed #999" }}
          >
            <span style={{ marginLeft: "0.5rem" }}>Current Quarter</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis
            dataKey="displayDate"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
            stroke="var(--text-secondary)"
          />
          <YAxis
            label={{
              value: "GDP (Billions $)",
              angle: -90,
              position: "insideLeft",
            }}
            tick={{ fontSize: 12 }}
            stroke="var(--text-secondary)"
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Reference line for current quarter */}
          {currentQuarterDate && (
            <ReferenceLine
              x={currentQuarterDate}
              stroke="#999999"
              strokeDasharray="5 5"
              label={{
                value: "Today",
                position: "top",
                fill: "#666",
                fontSize: 12,
              }}
            />
          )}

          {/* Actual GDP Line (Historical) */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#dc2626"
            strokeWidth={4}
            dot={{ fill: "#dc2626", r: 6, strokeWidth: 2, stroke: "white" }}
            activeDot={{ r: 8, strokeWidth: 2 }}
            name="Real GDP"
            isAnimationActive={false}
          />

          {/* Nowcasting Predictions Line (Historical predictions) */}
          <Line
            type="monotone"
            dataKey="nowcasting"
            stroke="#f59e0b"
            strokeWidth={3}
            strokeDasharray="4 4"
            dot={{ fill: "#f59e0b", r: 5 }}
            activeDot={{ r: 7 }}
            name="Nowcasting"
            isAnimationActive={false}
          />

          {/* Predictions Line (Future) */}
          <Line
            type="monotone"
            dataKey="prediction"
            stroke="#3b82f6"
            strokeWidth={3}
            strokeDasharray="8 4"
            dot={{ fill: "#3b82f6", r: 6 }}
            activeDot={{ r: 8 }}
            name="Predictions"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="chart-info">
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-secondary)",
            marginTop: "1rem",
          }}
        >
          Red solid line shows real GDP over the past 4 quarters. Orange dotted
          line shows nowcasting model predictions from the past (to check for
          offset). Blue dashed line shows forward model predictions (Nowcast,
          H1, H2, H3). Vertical dashed line marks the current quarter.
        </p>
      </div>
    </div>
  );
};

export default GDPChart;
