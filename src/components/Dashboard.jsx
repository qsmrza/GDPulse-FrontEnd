import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MetricCard from './MetricCard';
import GDPChart from './GDPChart';
import IndicatorsGrid from './IndicatorsGrid';
import ModelMetrics from './ModelMetrics';
import TableOfContents from './TableOfContents';
import { TrendingUp, Activity, BarChart3, RefreshCw, Globe, LineChart, AlertCircle } from 'lucide-react';
import {
  getGDPHistoricalData,
  getCurrentPrediction,
  getEconomicIndicators,
  getFeatureImportance,
  getModelMetrics
} from '../services/mockData';
import {
  getPrediction,
  getHistoricalData
} from '../services/apiService';
import '../App.css';
import './Dashboard.css';

const G7_COUNTRIES = [
  { code: 'US', name: 'United States', apiCode: 'usa' },
  { code: 'CA', name: 'Canada', apiCode: 'canada' },
  { code: 'GB', name: 'United Kingdom', apiCode: 'uk' },
  { code: 'FR', name: 'France', apiCode: 'france' },
  { code: 'DE', name: 'Germany', apiCode: 'germany' },
  { code: 'IT', name: 'Italy', apiCode: 'italy' },
  { code: 'JP', name: 'Japan', apiCode: 'japan' }
];

const AVAILABLE_MODELS = [
  {
    id: 'nowcasting',
    name: 'Nowcast (Current Period)',
    description: 'Current period GDP estimate',
    horizon: 'h0 (nowcast)'
  },
  {
    id: 'forecasting_h1',
    name: 'Forecast (1 Quarter Ahead)',
    description: '1-quarter ahead forecast',
    horizon: 'h1 (1-step)'
  },
  {
    id: 'forecasting_h2',
    name: 'Forecast (2 Quarters Ahead)',
    description: '2-quarters ahead forecast',
    horizon: 'h2 (2-step)'
  },
  {
    id: 'forecasting_h3',
    name: 'Forecast (3 Quarters Ahead)',
    description: '3-quarters ahead forecast',
    horizon: 'h3 (3-step)'
  },
  {
    id: 'forecasting_h4',
    name: 'Forecast (4 Quarters Ahead)',
    description: '4-quarters ahead forecast (Coming Soon)',
    horizon: 'h4 (4-step)',
    disabled: true
  }
];

const Dashboard = () => {
  const { countryCode } = useParams();
  const navigate = useNavigate();
  const [gdpData, setGdpData] = useState([]);
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [selectedModel, setSelectedModel] = useState('nowcasting');
  const [predictionData, setPredictionData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [featureImportance, setFeatureImportance] = useState([]);
  const [modelMetrics, setModelMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Helper function to get API country code from display country code
  const getApiCountryCode = (displayCode) => {
    const country = G7_COUNTRIES.find(c => c.code === displayCode);
    return country ? country.apiCode : 'usa';
  };

  // Helper function to get country name from display code
  const getCountryName = (displayCode) => {
    const country = G7_COUNTRIES.find(c => c.code === displayCode);
    return country ? country.name : 'Country';
  };

  const countryName = getCountryName(countryCode);
  const apiCountryCode = getApiCountryCode(countryCode);

  const handleCountryChange = (e) => {
    const newCountryCode = e.target.value;
    navigate(`/dashboard/${newCountryCode}`);
  };

  // Load data when country or model changes
  useEffect(() => {
    loadData();
  }, [countryCode, selectedModel]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch prediction for selected model and country
      const prediction = await getPrediction(apiCountryCode, selectedModel);
      setPredictionData(prediction);

      // Fetch historical data for the model and country
      const history = await getHistoricalData(apiCountryCode, selectedModel, 4);
      setHistoricalData(history.historical_data || []);

      // Still using mock data for other sections
      setIndicators(getEconomicIndicators());
      setFeatureImportance(getFeatureImportance());
      setModelMetrics(getModelMetrics());

      // Build chart data combining historical + prediction
      const chartData = buildChartData(history.historical_data || [], prediction);
      setGdpData(chartData);

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert date to quarterly format
  const getQuarterLabel = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth();
    const quarter = Math.floor(month / 3) + 1;
    return `${year} Q${quarter}`;
  };

  const buildChartData = (historical, prediction) => {
    // Show more quarters for nowcasting to see historical performance
    const quartersToShow = selectedModel === 'nowcasting' ? 12 : 5;
    const recentHistorical = historical.slice(-quartersToShow);

    // Transform historical data with quarterly labels and confidence bands
    const histData = recentHistorical.map((item) => ({
      date: item.date,
      displayDate: getQuarterLabel(item.date),
      actual: item.actual_gdp,
      nowcasting: item.gdp, // Model's historical prediction
      lower: item.lower_bound,
      upper: item.upper_bound,
      isHistorical: true
    }));

    // For nowcasting, add current quarter prediction
    // For forecasts, add future prediction
    const isNowcast = selectedModel === 'nowcasting';
    const currentDate = new Date();
    const predictionQuarter = Math.floor(currentDate.getMonth() / 3) + 1;
    const predictionYear = currentDate.getFullYear();
    const predictionLabel = `${predictionYear} Q${predictionQuarter}`;

    // Add current prediction as future point
    const predData = {
      date: prediction.date,
      displayDate: predictionLabel,
      prediction: prediction.prediction,
      lower: prediction.confidence_interval.lower,
      upper: prediction.confidence_interval.upper,
      modelName: AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name,
      isHistorical: false
    };

    return [...histData, predData];
  };

  const handleRefresh = () => {
    loadData();
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
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

  if (error) {
    return (
      <div className="loading-container">
        <AlertCircle className="loading-icon" size={48} style={{ color: 'var(--error-color)' }} />
        <h2>Error Loading Data</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={handleRefresh}>
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <main className="main-content">
      <TableOfContents />
      <div className="container">
        {/* Hero Section */}
        <section className="hero-section" id="hero">
          <div className="hero-content">
            <div className="dashboard-header-controls">
              <h1 className="hero-title">{countryName} - Real-Time GDP Predictions</h1>
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
              {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.description} -
              Machine learning predictions using Ridge regression on Federal Reserve indicators
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={handleRefresh}>
                <RefreshCw size={16} />
                Refresh Data
              </button>
              <div className="last-updated">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </section>

        {/* GDP Chart */}
        <section className="chart-section" id="chart">
          <GDPChart data={gdpData} />
        </section>

        {/* Model Selector */}
        <section className="model-selector-section" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LineChart size={20} style={{ color: 'var(--primary-color)' }} />
                <label style={{ fontWeight: '600', fontSize: '1rem' }}>Select Forecast Model:</label>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {AVAILABLE_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => !model.disabled && setSelectedModel(model.id)}
                    disabled={model.disabled}
                    className={selectedModel === model.id ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{
                      padding: '0.75rem 1.5rem',
                      fontSize: '0.9rem',
                      border: selectedModel === model.id ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                      backgroundColor: model.disabled ? '#f3f4f6' : (selectedModel === model.id ? 'var(--primary-color)' : 'transparent'),
                      color: model.disabled ? '#9ca3af' : (selectedModel === model.id ? 'white' : 'var(--text-primary)'),
                      cursor: model.disabled ? 'not-allowed' : 'pointer',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease',
                      opacity: model.disabled ? 0.6 : 1
                    }}
                    title={model.disabled ? 'Coming Soon' : model.description}
                  >
                    {model.name}
                  </button>
                ))}
              </div>
            </div>
            <p style={{
              textAlign: 'center',
              marginTop: '1rem',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)'
            }}>
              {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.description}
            </p>
          </div>
        </section>

        {/* Economic Indicators */}
        <section id="indicators">
          <IndicatorsGrid indicators={indicators} />
        </section>

        {/* Model Performance */}
        <section id="model-performance">
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

