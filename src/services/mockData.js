// Mock data service for GDP predictions and economic indicators
// This will be replaced with real API calls to the backend

// Generate historical GDP data with predictions
export const getGDPHistoricalData = () => {
  const data = [];
  const startYear = 2020;
  const startQuarter = 1;
  
  // Historical data (actual GDP)
  const historicalGDP = [
    { year: 2020, quarter: 1, gdp: 2.3, type: 'actual' },
    { year: 2020, quarter: 2, gdp: -9.0, type: 'actual' },
    { year: 2020, quarter: 3, gdp: 33.8, type: 'actual' },
    { year: 2020, quarter: 4, gdp: 4.5, type: 'actual' },
    { year: 2021, quarter: 1, gdp: 6.3, type: 'actual' },
    { year: 2021, quarter: 2, gdp: 6.7, type: 'actual' },
    { year: 2021, quarter: 3, gdp: 2.3, type: 'actual' },
    { year: 2021, quarter: 4, gdp: 7.0, type: 'actual' },
    { year: 2022, quarter: 1, gdp: -1.6, type: 'actual' },
    { year: 2022, quarter: 2, gdp: -0.6, type: 'actual' },
    { year: 2022, quarter: 3, gdp: 3.2, type: 'actual' },
    { year: 2022, quarter: 4, gdp: 2.6, type: 'actual' },
    { year: 2023, quarter: 1, gdp: 2.2, type: 'actual' },
    { year: 2023, quarter: 2, gdp: 2.1, type: 'actual' },
    { year: 2023, quarter: 3, gdp: 4.9, type: 'actual' },
    { year: 2023, quarter: 4, gdp: 3.4, type: 'actual' },
    { year: 2024, quarter: 1, gdp: 1.6, type: 'actual' },
    { year: 2024, quarter: 2, gdp: 3.0, type: 'actual' },
    { year: 2024, quarter: 3, gdp: 2.8, type: 'actual' },
  ];
  
  // Add predicted values for upcoming quarters
  const predictions = [
    { year: 2024, quarter: 4, gdp: 2.7, type: 'predicted' },
    { year: 2025, quarter: 1, gdp: 2.5, type: 'predicted' },
    { year: 2025, quarter: 2, gdp: 2.4, type: 'predicted' },
  ];
  
  return [...historicalGDP, ...predictions].map(item => ({
    ...item,
    period: `${item.year} Q${item.quarter}`,
    label: `Q${item.quarter} ${item.year}`
  }));
};

// Current GDP prediction with confidence metrics
export const getCurrentPrediction = () => {
  return {
    currentGDP: 2.7,
    previousGDP: 2.8,
    change: -0.1,
    changePercent: -3.6,
    rSquared: 0.73,
    rmse: 1.24,
    lastUpdated: new Date().toISOString(),
    confidence: 'High',
    quarterLabel: 'Q4 2024'
  };
};

// Economic indicators from FRED
export const getEconomicIndicators = () => {
  return [
    {
      id: 'UNRATE',
      name: 'Unemployment Rate',
      value: 3.8,
      unit: '%',
      change: -0.1,
      importance: 'high',
      description: 'Civilian unemployment rate'
    },
    {
      id: 'INDPRO',
      name: 'Industrial Production',
      value: 103.2,
      unit: 'Index',
      change: 0.5,
      importance: 'high',
      description: 'Industrial production index'
    },
    {
      id: 'RSXFS',
      name: 'Retail Sales',
      value: 709.8,
      unit: 'Billions $',
      change: 2.1,
      importance: 'high',
      description: 'Advance retail sales'
    },
    {
      id: 'UMCSENT',
      name: 'Consumer Sentiment',
      value: 68.9,
      unit: 'Index',
      change: -1.2,
      importance: 'medium',
      description: 'University of Michigan consumer sentiment'
    },
    {
      id: 'HOUST',
      name: 'Housing Starts',
      value: 1.372,
      unit: 'Millions',
      change: 3.7,
      importance: 'medium',
      description: 'New privately owned housing starts'
    },
    {
      id: 'PAYEMS',
      name: 'Non-farm Payroll',
      value: 157.2,
      unit: 'Millions',
      change: 0.2,
      importance: 'high',
      description: 'Total non-farm payroll employment'
    },
    {
      id: 'DCOILWTICO',
      name: 'Oil Prices',
      value: 78.5,
      unit: '$/Barrel',
      change: -2.3,
      importance: 'medium',
      description: 'Crude oil West Texas Intermediate'
    },
    {
      id: 'VIXCLS',
      name: 'Market Volatility (VIX)',
      value: 14.2,
      unit: 'Index',
      change: -0.8,
      importance: 'medium',
      description: 'CBOE volatility index'
    },
    {
      id: 'T10Y2Y',
      name: 'Yield Curve (10Y-2Y)',
      value: 0.15,
      unit: '%',
      change: 0.05,
      importance: 'high',
      description: '10-Year minus 2-Year Treasury spread'
    },
    {
      id: 'CPIAUCSL',
      name: 'Consumer Price Index',
      value: 315.2,
      unit: 'Index',
      change: 0.3,
      importance: 'high',
      description: 'CPI for all urban consumers'
    },
    {
      id: 'PERMIT',
      name: 'Building Permits',
      value: 1.495,
      unit: 'Millions',
      change: 1.8,
      importance: 'low',
      description: 'New privately owned housing permits'
    },
    {
      id: 'M2SL',
      name: 'M2 Money Supply',
      value: 21087.2,
      unit: 'Billions $',
      change: 0.4,
      importance: 'medium',
      description: 'M2 money stock'
    }
  ];
};

// Feature importance for ML model
export const getFeatureImportance = () => {
  return [
    { feature: 'Unemployment Rate', importance: 0.18 },
    { feature: 'Industrial Production', importance: 0.16 },
    { feature: 'Consumer Sentiment', importance: 0.14 },
    { feature: 'Yield Curve', importance: 0.12 },
    { feature: 'Retail Sales', importance: 0.11 },
    { feature: 'Non-farm Payroll', importance: 0.09 },
    { feature: 'Housing Starts', importance: 0.08 },
    { feature: 'CPI', importance: 0.07 },
    { feature: 'Oil Prices', importance: 0.03 },
    { feature: 'Market Volatility', importance: 0.02 }
  ];
};

// Model performance metrics
export const getModelMetrics = () => {
  return {
    rSquared: 0.73,
    rmse: 1.24,
    mae: 0.89,
    accuracy: 73.2,
    lastTrainingDate: '2024-10-20',
    trainingDataPoints: 96,
    algorithm: 'Random Forest Ensemble'
  };
};

