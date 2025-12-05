import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import "./GDPChart.css";

const GDPChart = ({ data }) => {
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
          No prediction data available. Please check that the backend is running.
        </div>
      </div>
    );
  }

  // Custom tooltip to show formatted values
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ margin: "0 0 8px 0", fontWeight: "600", color: "#333" }}>
            {data.quarter || data.displayDate}
          </p>
          {data.actual !== undefined && data.actual !== null && (
            <p style={{ margin: "4px 0", color: "#dc2626", fontSize: "14px" }}>
              <strong>Actual GDP:</strong> {data.actual.toFixed(2)}%
            </p>
          )}
          {data.predicted !== undefined && data.predicted !== null && (
            <p style={{ margin: "4px 0", color: "#f59e0b", fontSize: "14px" }}>
              <strong>Predicted:</strong> {data.predicted.toFixed(2)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Format Y-axis labels
  const formatYAxis = (value) => `${value.toFixed(1)}%`;

  return (
    <div className="gdp-chart-container card">
      <div className="chart-header">
        <h2 className="chart-title">GDP Predictions vs Historical Data</h2>
      </div>

      <ResponsiveContainer width="100%" height={450}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="quarter"
            angle={-45}
            textAnchor="end"
            height={80}
            style={{ fontSize: "12px" }}
            tick={{ fill: "#6b7280" }}
          />
          <YAxis
            tickFormatter={formatYAxis}
            style={{ fontSize: "12px" }}
            tick={{ fill: "#6b7280" }}
            label={{
              value: "GDP Growth Rate (%)",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: "14px", fontWeight: "500", fill: "#374151" },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="line"
            wrapperStyle={{ paddingBottom: "10px" }}
          />

          {/* Actual GDP Line */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#dc2626"
            strokeWidth={3}
            dot={{ fill: "#dc2626", r: 5 }}
            activeDot={{ r: 7 }}
            name="Actual GDP"
            connectNulls={false}
          />

          {/* Predicted GDP Line */}
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: "#f59e0b", r: 4 }}
            activeDot={{ r: 6 }}
            name="Model Predictions"
            connectNulls={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GDPChart;
