const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow CORS for your frontend

// Endpoint to fetch price data
app.get('/api/price/:commodity', async (req, res) => {
  const { commodity } = req.params;

  try {
    // Fetch the FAMA dashboard page (URL from @FamaMid posts on X)
    const response = await axios.get('https://sdvi.fama.gov.my/price_dashboard', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Scrape the price data (adjust selectors based on actual dashboard HTML structure)
    // This is hypothetical; inspect the dashboard to find the correct selectors
    const priceElements = $(`td:contains("${commodity}")`).parent();
    if (priceElements.length === 0) {
      throw new Error(`No price data found for ${commodity}`);
    }

    // Assuming the table has columns: Commodity, Market, Price, Date
    const latestPriceRow = priceElements.first();
    const previousPriceRow = priceElements.eq(1);

    const latestPrice = parseFloat(latestPriceRow.find('td:nth-child(3)').text().trim()).toFixed(2);
    const previousPrice = parseFloat(previousPriceRow.find('td:nth-child(3)').text().trim()).toFixed(2);

    // Calculate percentage change
    const percentageChange = (((latestPrice - previousPrice) / previousPrice) * 100).toFixed(2);

    res.json({
      price: latestPrice,
      percentageChange,
    });
  } catch (error) {
    console.error('Error scraping FAMA price data:', error.message);
    res.status(500).json({ price: 50, percentageChange: 0.08 }); // Fallback values
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});