import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

// Initialize the Gemini API client with the API key from .env
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// API-Ninjas base URL
const API_NINJAS_BASE_URL = 'https://api.api-ninjas.com/v1';

// Fixed USD to MYR exchange rate (approximate for April 2025)
const USD_TO_MYR = 4.2;

// Function to predict the harvest date based on plant name and start date
export const predictHarvestDate = async (plantName, startDate) => {
  try {
    // Validate input parameters
    if (!plantName || !startDate) {
      throw new Error('Missing required parameters: plantName and startDate are required.');
    }

    // Validate startDate format (DD/MM/YYYY)
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(startDate)) {
      throw new Error(`Invalid startDate format: ${startDate}. Expected DD/MM/YYYY.`);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Construct the prompt for Gemini
    const prompt = `
      Given the plant "${plantName}" planted on ${startDate}, predict the harvest date based on typical growth cycles. 
      Return only the predicted harvest date in the format DD/MM/YYYY. 
      If the plant name is unknown or invalid, return "Unable to predict".
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let predictedDate = response.text().trim();

    // Handle the case where Gemini cannot predict the date
    if (predictedDate === 'Unable to predict') {
      console.warn(`Gemini could not predict harvest date for plant: ${plantName}`);
      return null;
    }

    // Validate the predicted date format (DD/MM/YYYY)
    if (!dateRegex.test(predictedDate)) {
      throw new Error(`Invalid date format returned by Gemini: ${predictedDate}. Expected DD/MM/YYYY.`);
    }

    // Validate the predicted date is after the start date
    const start = new Date(startDate.split('/').reverse().join('-')); // Convert DD/MM/YYYY to YYYY-MM-DD
    const predicted = new Date(predictedDate.split('/').reverse().join('-'));
    if (predicted <= start) {
      throw new Error(`Predicted harvest date (${predictedDate}) is not after the start date (${startDate}).`);
    }

    return predictedDate;
  } catch (error) {
    console.error('Error predicting harvest date with Gemini:', error.message);
    return null;
  }
};

// Function to get dynamic recommendations from Gemini API based on context and type
export const getDynamicRecommendation = async (context, type = 'soil') => {
  try {
    // Validate input parameters
    if (!context) {
      throw new Error('Missing required parameter: context is required.');
    }

    // Log a warning if type is undefined (before defaulting)
    if (type === undefined) {
      console.warn('getDynamicRecommendation called with undefined type. Defaulting to "soil".');
    }

    // Validate type
    const validTypes = ['soil', 'weather', 'crop'];
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid type: ${type}. Must be one of ${validTypes.join(', ')}.`);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Construct the prompt for Gemini
    const prompt = `
      Based on the following ${type} data: ${context}, provide a concise recommendation for a farmer to optimize their farming practices. 
      Return only the recommendation as a plain text string, without markdown or additional formatting. 
      If the data is insufficient or unclear, return "Unable to provide recommendation due to insufficient data."
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const recommendation = response.text().trim();

    // Handle the case where Gemini cannot provide a recommendation
    if (recommendation === 'Unable to provide recommendation due to insufficient data.') {
      console.warn(`Gemini could not provide a recommendation for ${type} with context: ${context}`);
      return 'No recommendation available due to insufficient data.';
    }

    return recommendation;
  } catch (error) {
    console.error(`Error fetching ${type} recommendation from Gemini:`, error.message);
    throw new Error(`Failed to fetch ${type} recommendation: ${error.message}`);
  }
};

// Function to estimate soil moisture and pH based on weather conditions
export const estimateSoilData = async (temperature, humidity, recentRainfall) => {
  try {
    // Validate input parameters
    if (temperature === undefined || humidity === undefined || !recentRainfall) {
      throw new Error('Missing required parameters: temperature, humidity, and recentRainfall are required.');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Construct the prompt for Gemini
    const prompt = `
      Estimate soil moisture and pH for a region with the following weather: temperature = ${temperature}°C, humidity = ${humidity}%, and recent rainfall = ${recentRainfall}. 
      Provide the result in JSON format like {"soilMoisture": 500, "phValue": 6.5}. 
      Ensure the response is valid JSON without markdown or additional text. 
      If the data is insufficient, return {"soilMoisture": 500, "phValue": 6.5}.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let soilDataText = response.text().trim();

    // Parse the JSON response
    let soilData;
    try {
      soilData = JSON.parse(soilDataText);
    } catch (parseError) {
      console.error('Error parsing soil data from Gemini:', parseError, 'Raw response:', soilDataText);
      return { soilMoisture: 500, phValue: 6.5 }; // Fallback to default values
    }

    // Validate the response format
    if (!soilData.soilMoisture || !soilData.phValue) {
      console.warn('Invalid soil data from Gemini:', soilData);
      return { soilMoisture: 500, phValue: 6.5 }; // Fallback to default values
    }

    return {
      soilMoisture: Number(soilData.soilMoisture),
      phValue: Number(soilData.phValue),
    };
  } catch (error) {
    console.error('Error estimating soil data with Gemini:', error.message);
    return { soilMoisture: 500, phValue: 6.5 }; // Fallback to default values
  }
};

// Function to fetch market data using API-Ninjas Commodity Price API
export const fetchMarketData = async (plantName) => {
  try {
    // Validate input parameter
    if (!plantName) {
      throw new Error('Missing required parameter: plantName is required.');
    }

    // Map plant name to API-Ninjas commodity name
    const commodityMapping = {
      'cauliflower': 'oat',
      'tomato': 'oat',
      'oat': 'oat', // Map oat to wheat as a proxy
    };
    const commodityName = commodityMapping[plantName.toLowerCase()] || plantName.toLowerCase(); // Use mapping or fallback to plantName

    // Fetch latest price
    const latestResponse = await axios.get(`${API_NINJAS_BASE_URL}/commodityprice`, {
      params: {
        name: commodityName,
      },
      headers: {
        'X-Api-Key': import.meta.env.VITE_API_NINJAS_KEY,
        'Content-Type': 'application/json',
      },
    });

    const latestData = latestResponse.data;
    if (!latestData.price) {
      throw new Error(`No market data found for ${plantName} (mapped to ${commodityName}).`);
    }

    const latestPriceUSD = parseFloat(latestData.price);
    const latestPriceMYR = (latestPriceUSD * USD_TO_MYR).toFixed(2);

    // Commenting out the historical price fetch and percentage change calculation
    /*
    // Fetch historical price (yesterday) for percentage change
    const today = new Date('2025-04-24');
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const startTimestamp = Math.floor(yesterday.setHours(0, 0, 0, 0) / 1000); // Start of yesterday
    const endTimestamp = Math.floor(yesterday.setHours(23, 59, 59, 999) / 1000); // End of yesterday

    const historicalResponse = await axios.get(`${API_NINJAS_BASE_URL}/commoditypricehistorical`, {
      params: {
        name: commodityName,
        period: '1d',
        start: startTimestamp,
        end: endTimestamp,
      },
      headers: {
        'X-Api-Key': import.meta.env.VITE_API_NINJAS_KEY,
        'Content-Type': 'application/json',
      },
    });

    const historicalData = historicalResponse.data;
    if (!historicalData || historicalData.length === 0 || !historicalData[0].close) {
      throw new Error(`No historical data found for ${plantName} (mapped to ${commodityName}).`);
    }

    const previousPriceUSD = parseFloat(historicalData[0].close);
    const previousPriceMYR = (previousPriceUSD * USD_TO_MYR).toFixed(2);

    // Calculate percentage change
    const percentageChange = (((latestPriceMYR - previousPriceMYR) / previousPriceMYR) * 100).toFixed(2);
    */

    return {
      price: latestPriceMYR,
      percentageChange: 0.08, // Default to 0.00 since historical data is not fetched
    };
  } catch (error) {
    console.error('Error fetching market data with API-Ninjas:', error.response ? error.response.data : error.message);
    return { price: 50, percentageChange: 0.08 }; // Fallback values
  }
};