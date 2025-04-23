import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client with the API key from .env
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

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

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }); // Corrected to gemini-1.5-flash

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
export const getDynamicRecommendation = async (context, type = 'soil') => { // Added default value for type
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

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }); // Corrected to gemini-1.5-flash

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

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Corrected to gemini-1.5-flash

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