import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import GDPChart from './components/GDPChart';
import IndicatorsGrid from './components/IndicatorsGrid';
import ModelMetrics from './components/ModelMetrics';
import Footer from './components/Footer';
import TestApiCall from './components/TestApiCall'
import { TrendingUp, Activity, BarChart3, RefreshCw } from 'lucide-react';
import {
  getGDPHistoricalData,
  getCurrentPrediction,
  getEconomicIndicators,
  getFeatureImportance,
  getModelMetrics
} from './services/mockData';
import './App.css';

function App() {
  const [gdpData, setGdpData] = useState([]);
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [indicators, setIndicators] = useState([]);
  const [featureImportance, setFeatureImportance] = useState([]);
  const [modelMetrics, setModelMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulated data loading
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setGdpData(getGDPHistoricalData());
      setCurrentPrediction(getCurrentPrediction());
      setIndicators(getEconomicIndicators());
      setFeatureImportance(getFeatureImportance());
      setModelMetrics(getModelMetrics());
      setLastUpdated(new Date());
      setLoading(false);
    }, 800);
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

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="container">
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
          <section className="metrics-section">
            <div className="grid grid-3">
              <MetricCard
                title="Current GDP Forecast"
                value={currentPrediction.currentGDP}
                unit="%"
                change={currentPrediction.changePercent}
                subtitle={`Predicted for ${currentPrediction.quarterLabel}`}
                icon={TrendingUp}
              />
              <MetricCard
                title="Model R² Score"
                value={currentPrediction.rSquared}
                unit=""
                change={8.5}
                subtitle="Prediction accuracy measure"
                icon={BarChart3}
              />
              <MetricCard
                title="Prediction RMSE"
                value={currentPrediction.rmse}
                unit=""
                change={-5.2}
                subtitle="Root mean square error"
                icon={Activity}
              />
            </div>
          </section>

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

