require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs').promises;

const app = express();
app.use(cors());

const CACHE_FILE = './price_cache.json';
const fallbackPrices = {
  cauliflower: { price: 16.25, percentageChange: 5.24 },
  tomato: { price: 9, percentageChange: 5.24 },
  oat: { price: 10, percentageChange: 5.24 },
  corn: { price: 3, percentageChange: 5.24 },
  banana: { price: 5, percentageChange: 5.24 },
  apple: { price: 10, percentageChange: 5.24 },
};

const loadCache = async () => {
  try {
    const data = await fs.readFile(CACHE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
};

const saveCache = async (data) => {
  await fs.writeFile(CACHE_FILE, JSON.stringify(data, null, 2));
};

app.get('/api/price/:commodity', async (req, res) => {
  const { commodity } = req.params;
  const query = `${commodity} price in Malaysia per kg "RM" OR "MYR" -inurl:(signup OR login OR cart OR checkout)`;

  try {
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: process.env.GOOGLE_API_KEY,
        cx: process.env.GOOGLE_CX,
        q: query,
        num: 10,
      },
    });

    const searchResults = response.data.items || [];
    console.log(`Search results for ${commodity}:`, searchResults.map(item => item.snippet));

    if (!searchResults.length) {
      throw new Error('No search results found');
    }

    const textToAnalyze = searchResults.map(item => item.snippet).join(' ');
    console.log(`Text to analyze for ${commodity}:`, textToAnalyze);

    const priceRegex = new RegExp(`${commodity}\\s*(?:price)?\\s*(?:RM|MYR)\\s*(\\d+\\.?\\d*)\\s*(?:per\\s*(?:kg|kilogram)|\/kg|kg)|${commodity}\\s*(?:price)?\\s*(\\d+\\.?\\d*)\\s*(?:RM|MYR)\\s*(?:per\\s*(?:kg|kilogram)|\/kg|kg)`, 'i');
    const match = textToAnalyze.match(priceRegex);
    console.log(`Regex match for ${commodity}:`, match);

    if (!match) {
      throw new Error('No price data found in search results');
    }

    const latestPrice = parseFloat(match[1] || match[2]).toFixed(2);
    const previousPrice = latestPrice * 0.95; // Simulate previous price (5% less)
    const percentageChange = (((latestPrice - previousPrice) / previousPrice) * 100).toFixed(2);

    const cache = await loadCache();
    cache[commodity] = { price: latestPrice, percentageChange };
    await saveCache(cache);

    res.json({
      price: parseFloat(latestPrice),
      percentageChange: parseFloat(percentageChange),
    });
  } catch (error) {
    console.error(`Error fetching price data for ${commodity}:`, error.message);
    if (error.response) {
      console.error('API Response:', error.response.data);
    }
    const cache = await loadCache();
    const normalizedCommodity = commodity.toLowerCase();
    if (cache[commodity]) {
      console.log(`Using cached data for ${commodity}`);
      res.json(cache[commodity]);
    } else if (fallbackPrices[normalizedCommodity]) {
      console.log(`Using fallback price for ${commodity}`);
      res.json(fallbackPrices[normalizedCommodity]);
    } else {
      res.status(500).json({ price: 50, percentageChange: 0.08 });
    }
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});