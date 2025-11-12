import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MetricCard from './MetricCard';
import GDPChart from './GDPChart';
import IndicatorsGrid from './IndicatorsGrid';
import ModelMetrics from './ModelMetrics';
import TestApiCall from './TestApiCall';
import { TrendingUp, Activity, BarChart3, RefreshCw, Globe } from 'lucide-react';
import {
  getGDPHistoricalData,
  getCurrentPrediction,
  getEconomicIndicators,
  getFeatureImportance,
  getModelMetrics
} from '../services/mockData';
import '../App.css';
import './Dashboard.css';

const G7_COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' }
];

const Dashboard = () => {
  const { countryCode } = useParams();
  const navigate = useNavigate();
  const [gdpData, setGdpData] = useState([]);
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [indicators, setIndicators] = useState([]);
  const [featureImportance, setFeatureImportance] = useState([]);
  const [modelMetrics, setModelMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const countryNames = {
    'US': 'United States',
    'CA': 'Canada',
    'GB': 'United Kingdom',
    'FR': 'France',
    'DE': 'Germany',
    'IT': 'Italy',
    'JP': 'Japan'
  };

  const countryName = countryNames[countryCode] || 'Country';

  const handleCountryChange = (e) => {
    const newCountryCode = e.target.value;
    navigate(`/dashboard/${newCountryCode}`);
  };

  // Simulated data loading
  useEffect(() => {
    loadData();
  }, [countryCode]);

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
        <p>Fetching real-time economic data for {countryName}</p>
      </div>
    );
  }

  return (
    <main className="main-content">
      <div className="container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="dashboard-header-controls">
              <h1 className="hero-title">{countryName} - Real-Time GDP Nowcasting</h1>
              <div className="country-selector-wrapper">
                <Globe className="country-selector-icon" size={18} />
                <select 
                  className="country-selector"
                  value={countryCode || 'US'}
                  onChange={handleCountryChange}
                >
                  {G7_COUNTRIES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
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
  );
};

export default Dashboard;

