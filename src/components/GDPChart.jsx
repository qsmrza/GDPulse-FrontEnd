import React from "react";
import ReactApexChart from "react-apexcharts";
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
          No prediction data available. Please check that the backend is running.
        </div>
      </div>
    );
  }

  // Prepare data for ApexCharts
  // Split into historical data and prediction
  const historicalData = data.filter((item) => item.isHistorical);
  const predictionData = data.filter((item) => !item.isHistorical);

  // Format data for ApexCharts - combine historical and prediction for continuous lines
  // Convert to billions and round to whole numbers
  const toBillions = (value) => Math.round(value);

  // Series 1: Actual GDP (Line) - historical only
  const actualGdpData = historicalData
    .filter((item) => item.actual !== undefined && item.actual !== null)
    .map((item) => ({
      x: item.displayDate || item.date,
      y: toBillions(item.actual),
    }));

  // Series 2: Model Predictions (Line - dashed) - includes all predictions
  const allPredictions = [
    ...historicalData
      .filter((item) => item.nowcasting !== undefined && item.nowcasting !== null && !isNaN(item.nowcasting))
      .map((item) => ({
        x: item.displayDate || item.date,
        y: toBillions(item.nowcasting),
      })),
    ...predictionData
      .filter((item) => item.prediction !== undefined && item.prediction !== null && !isNaN(item.prediction))
      .map((item) => ({
        x: item.displayDate || item.date,
        y: toBillions(item.prediction),
      }))
  ];

  // Series 3: Confidence Interval (Range Area) - for all predictions (historical + current)
  const confidenceIntervalData = [
    ...historicalData
      .filter((item) => item.lower !== undefined && item.upper !== undefined)
      .map((item) => ({
        x: item.displayDate || item.date,
        y: [toBillions(item.lower), toBillions(item.upper)],
      })),
    ...predictionData
      .filter((item) => item.lower !== undefined && item.upper !== undefined)
      .map((item) => ({
        x: item.displayDate || item.date,
        y: [toBillions(item.lower), toBillions(item.upper)],
      }))
  ];

  const series = [
    {
      type: "line",
      name: "Actual GDP",
      data: actualGdpData,
    },
    {
      type: "line",
      name: "Model Predictions",
      data: allPredictions,
    },
    {
      type: "rangeArea",
      name: "95% Confidence Interval",
      data: confidenceIntervalData,
    },
  ];

  const options = {
    chart: {
      height: 450,
      type: "rangeArea",
      animations: {
        enabled: true,
        speed: 500,
      },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
    },
    colors: ["#dc2626", "#f59e0b", "#3b82f6"],
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: [1, 1, 0.15],
    },
    stroke: {
      curve: "straight",
      width: [3, 2, 0],
      dashArray: [0, 5, 0],
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "center",
      fontSize: "13px",
      markers: {
        width: 12,
        height: 12,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    title: {
      text: "GDP Nowcasting: Predictions vs Actual",
      align: "left",
      style: {
        fontSize: "18px",
        fontWeight: "600",
        color: "var(--text-primary)",
      },
    },
    xaxis: {
      type: "category",
      labels: {
        rotate: -45,
        rotateAlways: true,
        style: {
          fontSize: "11px",
        },
      },
      title: {
        text: "Date",
        style: {
          fontSize: "12px",
          fontWeight: "500",
        },
      },
    },
    yaxis: {
      title: {
        text: "GDP (Billions USD)",
        style: {
          fontSize: "12px",
          fontWeight: "500",
        },
      },
      labels: {
        formatter: function (value) {
          return value ? `$${Math.round(value)}B` : "";
        },
        style: {
          fontSize: "11px",
        },
      },
    },
    tooltip: {
      shared: false,
      intersect: true,
      y: {
        formatter: function (value, { seriesIndex, dataPointIndex, w }) {
          if (seriesIndex === 3) {
            // Confidence interval (rangeArea)
            return `$${Math.round(value)}B`;
          }
          // Regular lines
          return value ? `$${Math.round(value)}B` : "";
        },
      },
    },
    markers: {
      size: [6, 6, 0],  // Show markers on actual and predictions
      strokeWidth: [2, 2, 0],
      strokeColors: ["#fff", "#fff", "#fff"],
      hover: {
        sizeOffset: 3,
      },
    },
    grid: {
      borderColor: "var(--border-color)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  };

  return (
    <div className="gdp-chart-container card">
      <div className="chart-header">
        <h2 className="chart-title">GDP Predictions vs Historical Data</h2>
      </div>

      <ReactApexChart
        options={options}
        series={series}
        type="rangeArea"
        height={450}
      />

      <div className="chart-info">
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-secondary)",
            marginTop: "1rem",
            padding: "0 1rem",
          }}
        >
          <strong>Red solid line</strong> shows actual GDP growth from historical data.{" "}
          <strong>Orange dashed line</strong> shows the model's predictions across all time periods.{" "}
          <strong>Shaded blue area</strong> represents the 95% confidence interval for all predictions.
        </p>
      </div>
    </div>
  );
};

export default GDPChart;
