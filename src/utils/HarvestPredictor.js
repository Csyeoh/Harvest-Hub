const mockApiCall = async (plantName, startDate) => {
  // Simulate API response delay (mimicking a real API call)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // If startDate is missing, return default values
  if (!startDate) {
    return {
      estimatedHarvestDate: "N/A",
      progress: 0,
      riskScore: 0,
    };
  }

  // Mock historical data for Prophet-like forecasting
  const growthPeriods = {
    Tomato: 90, // 3 months
    Carrot: 75, // 2.5 months
    Lettuce: 60, // 2 months
    Potato: 120, // 4 months
    default: 90, // Default growth period
  };

  // Simulate Prophet's trend and seasonality (simplified)
  const growthDays = growthPeriods[plantName] || growthPeriods.default;

  // Use the provided startDate
  const effectiveStartDate = new Date(startDate);

  // Calculate the harvest date
  const harvestDate = new Date(effectiveStartDate);
  harvestDate.setDate(effectiveStartDate.getDate() + growthDays);

  // Calculate progress (percentage of growth completed)
  const today = new Date();
  const totalGrowthMs = harvestDate - effectiveStartDate;
  const elapsedMs = today - effectiveStartDate;
  const progress = Math.min(100, Math.max(0, Math.round((elapsedMs / totalGrowthMs) * 100)));

  // Simulate risk score (e.g., based on mock weather data)
  const riskScore = Math.round(Math.random() * 30); // Random risk between 0-30%

  return {
    estimatedHarvestDate: harvestDate.toLocaleDateString("en-GB"), // e.g., "22/01/2026"
    progress: progress, // e.g., 30
    riskScore: riskScore, // e.g., 20
  };
};

const HarvestPredictor = async (plantName, startDate) => {
  try {
    const response = await mockApiCall(plantName, startDate);
    return response;
  } catch (err) {
    console.error("Error predicting harvest:", err);
    return {
      estimatedHarvestDate: "N/A",
      progress: 0,
      riskScore: 0,
    };
  }
};

export default HarvestPredictor;