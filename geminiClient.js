import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const getDynamicRecommendation = async (context, type = 'weather', promptOverride = null) => {
  const optimalRanges = type === 'weather'
    ? 'Optimal temperature: 20-30°C, Wind: <10 m/s, Weather: Clear to partly cloudy.'
    : type === 'soil'
    ? 'Optimal soil moisture: 20-60%, Optimal pH: 6.0-7.0.'
    : 'Optimal temperature: 20-30°C, Optimal soil moisture: 20-60%, Optimal pH: 6.0-7.0.';

  const prompt = promptOverride || (type === 'weather'
    ? `Given the following weather data and optimal ranges (${optimalRanges}), provide a specific, actionable recommendation for farmers growing a particular crop in less than 30 words: ${context}`
    : type === 'soil'
    ? `Given the following soil data and optimal ranges (${optimalRanges}), provide a specific, actionable action plan for farmers growing a particular crop in less than 30 words: ${context}`
    : `Given the following weather and soil data and optimal ranges (${optimalRanges}), provide a specific, actionable recommendation for farmers in less than 30 words: ${context}`);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestion = response.text();

    console.log('Raw Gemini API Recommendation (getDynamicRecommendation):', suggestion);

    if (!suggestion) {
      console.error('Gemini API response missing text:', response);
      return 'Failed to generate suggestion due to API response error.';
    }

    if (suggestion.trim().length < 5 || suggestion.toLowerCase().includes('no suggestion')) {
      return 'Unable to generate a meaningful suggestion.';
    }

    return suggestion;
  } catch (err) {
    console.error(`Error in getDynamicRecommendation (${type}):`, err.message);
    return `Failed to fetch ${type} suggestion: ${err.message}`;
  }
};