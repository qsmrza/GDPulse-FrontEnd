/**
 * API Service for GDPulse
 *
 * Handles all API communication for GDP predictions and economic indicators.
 * Connects directly to HuggingFace Space API.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Get pre-computed results for a country and model type
 * @param {string} country - Country code (usa, canada, uk, germany, france, italy, japan)
 * @param {string} modelType - Model type (nowcasting, forecasting_q1, forecasting_q2, forecasting_q3, forecasting_q4)
 */
export const getResults = async (country, modelType) => {
  try {
    const response = await fetch(`${API_BASE_URL}/results/${country}/${modelType}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching results for ${country} ${modelType}:`, error);
    throw error;
  }
};

/**
 * Fetch predictions from all 4 models at once for a specific country
 * DEPRECATED: Use getResults() instead for pre-computed results
 * @param {string} country - Country code (usa, canada, uk, germany, france, italy, japan)
 */
export const getAllPredictions = async (country = "usa") => {
  try {
    const modelNames = [
      "nowcasting",
      "forecasting_q1",
      "forecasting_q2",
      "forecasting_q3"
    ];

    // Fetch predictions from all models in parallel
    const promises = modelNames.map(model_type =>
      fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ country, model_type, features: null }),
      }).then(res => {
        if (!res.ok) {
          throw new Error(`API error for ${country} ${model_type}: ${res.status}`);
        }
        return res.json();
      })
    );

    const predictions = await Promise.all(promises);

    return {
      predictions,
      timestamp: new Date().toISOString(),
      cached: false
    };
  } catch (error) {
    console.error("Error fetching all predictions:", error);
    throw error;
  }
};

/**
 * Fetch prediction for a specific model and country
 * DEPRECATED: Use getResults() instead for pre-computed results
 * @param {string} country - Country code (usa, canada, uk, germany, france, italy, japan)
 * @param {string} modelType - Model type (nowcasting, forecasting_h1, forecasting_h2, forecasting_h3, forecasting_h4)
 * @param {Array<number>} features - Optional array of feature values
 */
export const getPrediction = async (country, modelType, features = null) => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        country: country,
        model_type: modelType,
        features: features
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching prediction for ${country} ${modelType}:`, error);
    throw error;
  }
};

/**
 * Check API health status
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
 * Get historical GDP data for a country and model
 * DEPRECATED: Use getResults() instead for pre-computed results
 * @param {string} country - Country code (usa, canada, uk, germany, france, italy, japan)
 * @param {string} modelType - Model type (nowcasting, forecasting_h1, forecasting_h2, forecasting_h3)
 * @param {number} quarters - Number of quarters to return (default 4)
 */
export const getHistoricalData = async (country, modelType, quarters = 4) => {
  try {
    const response = await fetch(`${API_BASE_URL}/history/${country}/${modelType}?quarters=${quarters}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching history for ${country} ${modelType}:`, error);
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

/**
 * Transform results API response to chart format for Recharts
 * @param {Object} resultsData - Response from getResults() endpoint
 * @returns {Array} Array of data points formatted for Recharts
 */
export const transformResultsToChartData = (resultsData) => {
  if (!resultsData || !resultsData.data) {
    return [];
  }

  return resultsData.data.map(item => ({
    quarter: item.quarter,
    date: item.date,
    actual: item.actual,
    predicted: item.predicted,
    lower_80: item.lower_80,
    upper_80: item.upper_80,
    lower_95: item.lower_95,
    upper_95: item.upper_95,
  }));
};

/**
 * Get all models' performance for a country and model type
 * @param {string} country - Country code (usa, canada, uk, germany, france, italy, japan)
 * @param {string} modelType - Model type (nowcasting, forecasting_q1, forecasting_q2, forecasting_q3, forecasting_q4)
 */
export const getAllModelsResults = async (country, modelType) => {
  try {
    const response = await fetch(`${API_BASE_URL}/results/${country}/${modelType}/all-models`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching all models results for ${country} ${modelType}:`, error);
    throw error;
  }
};
