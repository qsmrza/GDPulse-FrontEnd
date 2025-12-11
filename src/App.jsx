import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import FloatingLogo from "./components/FloatingLogo";
import ScrollToTop from "./components/ScrollToTop";
import PredictionCard from "./components/PredictionCard";
import GDPChart from "./components/GDPChart";
import IndicatorsGrid from "./components/IndicatorsGrid";
import ModelMetrics from "./components/ModelMetrics";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import { Activity, RefreshCw, AlertCircle } from "lucide-react";
import {
  getAllPredictions,
  transformPredictionsToChartData,
  checkHealth,
  getHistoricalData,
} from "./services/apiService";
import {
  getEconomicIndicators,
  getFeatureImportance,
  getModelMetrics,
} from "./services/mockData";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <FloatingLogo />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard/:countryCode" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
