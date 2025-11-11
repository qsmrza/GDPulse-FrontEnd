import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import GDPChart from './components/GDPChart';
import IndicatorsGrid from './components/IndicatorsGrid';
import ModelMetrics from './components/ModelMetrics';
import Footer from './components/Footer';
import TestApiCall from './components/TestApiCall'
import { TrendingUp, Activity, BarChart3, RefreshCw, AlertCircle } from 'lucide-react';
import {
  getAllPredictions,
  transformPredictionsToChartData,
  checkHealth
} from './services/apiService';
import {
  getEconomicIndicators,
  getFeatureImportance,
  getModelMetrics
} from './services/mockData';
import './App.css';

function App() {
  const [gdpData, setGdpData] = useState([]);
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

      // Transform predictions for chart display
      const chartData = transformPredictionsToChartData(allPredictions);
      setGdpData(chartData);
      setPredictions(allPredictions.predictions);

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

          {/* Current Prediction Cards */}
          {primaryPrediction && (
            <section className="metrics-section">
              <div className="grid grid-3">
                <MetricCard
                  title="GDP Nowcast (h1)"
                  value={primaryPrediction.prediction.toFixed(2)}
                  unit="(thousands)"
                  change={0}
                  subtitle={`Date: ${new Date(primaryPrediction.date).toLocaleDateString()}`}
                  icon={TrendingUp}
                />
                <MetricCard
                  title="Lower Bound (95%)"
                  value={primaryPrediction.confidence_interval.lower.toFixed(2)}
                  unit="(thousands)"
                  change={-2.5}
                  subtitle="Confidence interval lower"
                  icon={BarChart3}
                />
                <MetricCard
                  title="Upper Bound (95%)"
                  value={primaryPrediction.confidence_interval.upper.toFixed(2)}
                  unit="(thousands)"
                  change={2.5}
                  subtitle="Confidence interval upper"
                  icon={Activity}
                />
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

