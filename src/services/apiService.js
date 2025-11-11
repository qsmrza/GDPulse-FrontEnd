/**
 * API Service for GDPulse
 *
 * Handles all backend communication for GDP predictions and economic indicators.
 * Provides methods to fetch predictions from the local backend API.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

/**
 * Fetch predictions from all 4 models at once
 */
export const getAllPredictions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict-all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all predictions:", error);
    throw error;
  }
};

/**
 * Fetch prediction for a specific model
 * @param {string} modelName - Model name (nowcasting_h1, forecasting_h1, forecasting_h2, forecasting_h3)
 * @param {Array<number>} features - Optional array of feature values
 */
export const getPrediction = async (modelName, features = null) => {
  try {
    const params = new URLSearchParams();
    if (features) {
      params.append("features", JSON.stringify(features));
    }

    const url = `${API_BASE_URL}/predict/${modelName}${params.toString() ? "?" + params.toString() : ""}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching prediction for ${modelName}:`, error);
    throw error;
  }
};

/**
 * Check backend health status
 */
export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking health:", error);
    throw error;
  }
};

/**
 * Get historical GDP data for a model
 * @param {string} modelName - Model name
 * @param {number} quarters - Number of quarters to retrieve (default 4)
 */
export const getHistoricalData = async (modelName, quarters = 4) => {
  try {
    const response = await fetch(`${API_BASE_URL}/history/${modelName}?quarters=${quarters}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching history for ${modelName}:`, error);
    throw error;
  }
};

/**
 * Get list of available models
 */
export const getAvailableModels = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/models`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching models:", error);
    throw error;
  }
};

/**
 * Get cache information
 */
export const getCacheInfo = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cache/info`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching cache info:", error);
    throw error;
  }
};

/**
 * Clear cache
 */
export const clearCache = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cache/clear`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error clearing cache:", error);
    throw error;
  }
};

/**
 * Transform API predictions to chart format
 * Converts prediction response from backend to format suitable for Recharts
 *
 * @param {Object} allPredictions - Response from getAllPredictions()
 * @returns {Array} Array of data points for chart with confidence intervals
 */
export const transformPredictionsToChartData = (allPredictions) => {
  if (!allPredictions || !allPredictions.predictions) {
    return [];
  }

  const predictions = allPredictions.predictions;

  // Create chart data points - one for each model's prediction
  return predictions.map((pred, index) => {
    const horizonMap = {
      nowcasting_h1: "Nowcast (h1)",
      forecasting_h1: "Forecast (h1)",
      forecasting_h2: "Forecast (h2)",
      forecasting_h3: "Forecast (h3)",
    };

    return {
      name: horizonMap[pred.model_name] || pred.model_name,
      date: pred.date,
      prediction: pred.prediction,
      actual: pred.actual_gdp,
      lower: pred.confidence_interval.lower,
      upper: pred.confidence_interval.upper,
      std_error: pred.confidence_interval.std_error,
      model_name: pred.model_name,
      description: pred.model_description,
      timestamp: pred.timestamp,
      cached: pred.cached,
    };
  });
};
