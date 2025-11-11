import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PredictionCard from './components/PredictionCard';
import GDPChart from './components/GDPChart';
import IndicatorsGrid from './components/IndicatorsGrid';
import ModelMetrics from './components/ModelMetrics';
import Footer from './components/Footer';
import TestApiCall from './components/TestApiCall'
import { Activity, RefreshCw, AlertCircle } from 'lucide-react';
import {
  getAllPredictions,
  transformPredictionsToChartData,
  checkHealth,
  getHistoricalData
} from './services/apiService';
import {
  getEconomicIndicators,
  getFeatureImportance,
  getModelMetrics
} from './services/mockData';
import './App.css';

function App() {
  const [gdpData, setGdpData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [featureImportance, setFeatureImportance] = useState([]);
  const [modelMetrics, setModelMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [backendHealthy, setBackendHealthy] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check backend health
      await checkHealth();
      setBackendHealthy(true);

      // Fetch all predictions from backend
      const allPredictions = await getAllPredictions();
      setPredictions(allPredictions.predictions);

      // Fetch historical data from first model (they all have same historical data)
      const history = await getHistoricalData('forecasting_h1', 4);
      setHistoricalData(history.historical_data);

      // Transform predictions and historical data for chart display
      const chartData = buildChartData(allPredictions.predictions, history.historical_data);
      setGdpData(chartData);

      // Load mock data for indicators and metrics
      setIndicators(getEconomicIndicators());
      setFeatureImportance(getFeatureImportance());
      setModelMetrics(getModelMetrics());

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to connect to backend API. Make sure the backend server is running on port 8000.');
      setBackendHealthy(false);

      // Fall back to showing mock data if available
      setIndicators(getEconomicIndicators());
      setFeatureImportance(getFeatureImportance());
      setModelMetrics(getModelMetrics());
    } finally {
      setLoading(false);
    }
  };

  // Build chart data combining historical and predicted data
  const buildChartData = (predictions, historicalData) => {
    const chartData = [];

    // Add historical data points
    if (historicalData && historicalData.length > 0) {
      historicalData.forEach(item => {
        chartData.push({
          date: item.date,
          actual: item.gdp / 1000, // Convert to billions
          displayDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          isHistorical: true,
          isCurrentQuarter: false,
        });
      });
    }

    // Add current quarter marker (last historical date)
    if (historicalData && historicalData.length > 0) {
      const lastDate = new Date(historicalData[historicalData.length - 1].date);
      chartData.push({
        date: lastDate.toISOString().split('T')[0],
        actual: historicalData[historicalData.length - 1].gdp / 1000,
        displayDate: 'Today',
        isHistorical: true,
        isCurrentQuarter: true, // Mark for dotted line
        isDottedLine: true,
      });
    }

    // Add predictions with forward dates
    if (predictions && predictions.length > 0) {
      // Get base date from last prediction
      const baseDate = new Date(predictions[0].date);

      // nowcasting_h1: current quarter
      const nowcast = predictions.find(p => p.model_name === 'nowcasting_h1');
      if (nowcast) {
        chartData.push({
          date: baseDate.toISOString().split('T')[0],
          prediction: nowcast.prediction / 1000,
          displayDate: 'Nowcast',
          modelName: 'Nowcast (H1)',
          isPrediction: true,
          forecastHorizon: 0,
        });
      }

      // forecasting_h1: +1 quarter (add 90 days)
      const h1Date = new Date(baseDate);
      h1Date.setDate(h1Date.getDate() + 90);
      const forecast_h1 = predictions.find(p => p.model_name === 'forecasting_h1');
      if (forecast_h1) {
        chartData.push({
          date: h1Date.toISOString().split('T')[0],
          prediction: forecast_h1.prediction / 1000,
          displayDate: h1Date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          modelName: 'Forecast (H1)',
          isPrediction: true,
          forecastHorizon: 1,
        });
      }

      // forecasting_h2: +2 quarters (add 180 days)
      const h2Date = new Date(baseDate);
      h2Date.setDate(h2Date.getDate() + 180);
      const forecast_h2 = predictions.find(p => p.model_name === 'forecasting_h2');
      if (forecast_h2) {
        chartData.push({
          date: h2Date.toISOString().split('T')[0],
          prediction: forecast_h2.prediction / 1000,
          displayDate: h2Date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          modelName: 'Forecast (H2)',
          isPrediction: true,
          forecastHorizon: 2,
        });
      }

      // forecasting_h3: +3 quarters (add 270 days)
      const h3Date = new Date(baseDate);
      h3Date.setDate(h3Date.getDate() + 270);
      const forecast_h3 = predictions.find(p => p.model_name === 'forecasting_h3');
      if (forecast_h3) {
        chartData.push({
          date: h3Date.toISOString().split('T')[0],
          prediction: forecast_h3.prediction / 1000,
          displayDate: h3Date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          modelName: 'Forecast (H3)',
          isPrediction: true,
          forecastHorizon: 3,
        });
      }
    }

    return chartData;
  };

  const handleRefresh = () => {
    loadData();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Activity className="loading-icon" size={48} />
        <h2>Loading GDPulse...</h2>
        <p>Fetching real-time economic data</p>
      </div>
    );
  }

  const primaryPrediction = predictions.length > 0 ? predictions[0] : null;

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <div className="container">
          {/* Error Alert */}
          {error && (
            <div className="error-alert">
              <AlertCircle size={20} />
              <div>
                <strong>Connection Error</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Health Status */}
          {backendHealthy && (
            <div className="health-badge" style={{ marginBottom: '1rem', textAlign: 'center', color: '#10b981', fontSize: '0.875rem' }}>
              ✓ Backend Connected - Real-time predictions active
            </div>
          )}

          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-content">
              <h1 className="hero-title">Real-Time GDP Nowcasting</h1>
              <p className="hero-description">
                Machine learning-powered GDP predictions using high-frequency economic indicators from the Federal Reserve
              </p>
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={handleRefresh}>
                  <RefreshCw size={16} />
                  Refresh Data
                </button>
                <div className="last-updated">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
                <TestApiCall />
              </div>
            </div>
          </section>

          {/* Prediction Cards - Show all 4 models */}
          {predictions && predictions.length > 0 && (
            <section className="predictions-section">
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>Model Predictions</h2>
              <div className="grid grid-4">
                {predictions.map((prediction, index) => (
                  <PredictionCard
                    key={index}
                    prediction={prediction}
                    actualGdp={prediction.actual_gdp}
                  />
                ))}
              </div>
            </section>
          )}

          {/* GDP Chart */}
          <section className="chart-section">
            <GDPChart data={gdpData} />
          </section>

          {/* Economic Indicators */}
          <section>
            <IndicatorsGrid indicators={indicators} />
          </section>

          {/* Model Performance */}
          <section>
            <ModelMetrics 
              metrics={modelMetrics} 
              featureImportance={featureImportance} 
            />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;

