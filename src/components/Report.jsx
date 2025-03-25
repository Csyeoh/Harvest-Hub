import React, { useState, useRef } from 'react';
import './Report.css';

function Report() {
  // State for form inputs
  const [farmerName, setFarmerName] = useState('');
  const [plant, setPlant] = useState('');
  const [plantingStart, setPlantingStart] = useState('');
  const [plantingEnd, setPlantingEnd] = useState('');
  const [harvestAmount, setHarvestAmount] = useState('');
  const [pesticideUsed, setPesticideUsed] = useState('');
  const [pesticideAmount, setPesticideAmount] = useState('');
  const [fertilizerUsed, setFertilizerUsed] = useState('');
  const [fertilizerAmount, setFertilizerAmount] = useState('');
  const [disease, setDisease] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [plantImage, setPlantImage] = useState(null);

  // State for submitted report
  const [report, setReport] = useState(null);

  // Ref for the report section to print
  const reportRef = useRef();

  // Function to calculate pesticide (Tuesdays) and fertilizer (Wednesdays) dates
  const calculateApplicationDates = (startDate, endDate) => {
    const pesticideDates = []; // Tuesdays
    const fertilizerDates = []; // Wednesdays

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Loop through each day between start and end dates
    let current = new Date(start);
    while (current <= end) {
      const dayOfWeek = current.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      if (dayOfWeek === 2) { // Tuesday
        pesticideDates.push(current.toISOString().split('T')[0]); // Format as YYYY-MM-DD
      } else if (dayOfWeek === 3) { // Wednesday
        fertilizerDates.push(current.toISOString().split('T')[0]); // Format as YYYY-MM-DD
      }
      current.setDate(current.getDate() + 1); // Move to the next day
    }

    return { pesticideDates, fertilizerDates };
  };

  // Function to split dates into columns (max 10 rows per column, max 2 columns per type)
  const splitIntoColumns = (dates, maxRowsPerColumn = 10) => {
    const columns = [];
    let currentColumn = [];

    for (let i = 0; i < dates.length; i++) {
      if (currentColumn.length < maxRowsPerColumn) {
        currentColumn.push(dates[i]);
      } else {
        columns.push(currentColumn);
        currentColumn = [dates[i]];
      }
    }

    if (currentColumn.length > 0) {
      columns.push(currentColumn);
    }

    // Limit to 2 columns per type
    return columns.slice(0, 2);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const { pesticideDates, fertilizerDates } = calculateApplicationDates(plantingStart, plantingEnd);
    const pesticideColumns = splitIntoColumns(pesticideDates);
    const fertilizerColumns = splitIntoColumns(fertilizerDates);
    setReport({
      farmerName,
      plant,
      plantingStart,
      plantingEnd,
      harvestAmount,
      pesticideUsed,
      pesticideAmount,
      fertilizerUsed,
      fertilizerAmount,
      disease,
      currentPrice,
      plantImage: plantImage ? URL.createObjectURL(plantImage) : null,
      pesticideColumns,
      fertilizerColumns,
    });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setPlantImage(file);
  };

  // Handle print
  const handlePrint = () => {
    const printContent = reportRef.current;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  return (
    <div className="dashboard-content">
      <h1>Farm Report</h1>
      <div className="farm-report-container">
        {/* Form Section */}
        <div className="report-form">
          <h3>Create Farm Report</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Farmer's Name:</label>
              <input
                type="text"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                placeholder="e.g., John Doe"
                required
              />
            </div>
            <div className="form-group">
              <label>Plant:</label>
              <input
                type="text"
                value={plant}
                onChange={(e) => setPlant(e.target.value)}
                placeholder="e.g., Cauliflower"
                required
              />
            </div>
            <div className="form-group">
              <label>Planting Start Date:</label>
              <input
                type="date"
                value={plantingStart}
                onChange={(e) => setPlantingStart(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Planting End Date:</label>
              <input
                type="date"
                value={plantingEnd}
                onChange={(e) => setPlantingEnd(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Harvest Amount (kg):</label>
              <input
                type="number"
                value={harvestAmount}
                onChange={(e) => setHarvestAmount(e.target.value)}
                placeholder="e.g., 100"
                required
              />
            </div>
            <div className="form-group">
              <label>Pesticide Used:</label>
              <input
                type="text"
                value={pesticideUsed}
                onChange={(e) => setPesticideUsed(e.target.value)}
                placeholder="e.g., Organic Pesticide"
                required
              />
            </div>
            <div className="form-group">
              <label>Pesticide Amount (g):</label>
              <input
                type="number"
                value={pesticideAmount}
                onChange={(e) => setPesticideAmount(e.target.value)}
                placeholder="e.g., 500"
                required
              />
            </div>
            <div className="form-group">
              <label>Fertilizer Used:</label>
              <input
                type="text"
                value={fertilizerUsed}
                onChange={(e) => setFertilizerUsed(e.target.value)}
                placeholder="e.g., Urea"
                required
              />
            </div>
            <div className="form-group">
              <label>Fertilizer Amount (g):</label>
              <input
                type="number"
                value={fertilizerAmount}
                onChange={(e) => setFertilizerAmount(e.target.value)}
                placeholder="e.g., 1000"
                required
              />
            </div>
            <div className="form-group">
              <label>Disease:</label>
              <input
                type="text"
                value={disease}
                onChange={(e) => setDisease(e.target.value)}
                placeholder="e.g., None"
                required
              />
            </div>
            <div className="form-group">
              <label>Current Price (RM /kg):</label>
              <input
                type="text"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                placeholder="e.g., RM2.50/kg"
                required
              />
            </div>
            <button type="submit">Generate Report</button>
          </form>
        </div>

        {report && (
          <div className="report-display" ref={reportRef}>
            <h2>FARM REPORT</h2>
            <div className="report-header-line"></div>
            <div className="report-details">
              <div className="column">
                <p>
                  <strong>Farmer's Name:</strong> {report.farmerName}
                </p>
                <p>
                  <strong>Plant:</strong> {report.plant}
                </p>
                <p>
                  <strong>Start Date:</strong> {report.plantingStart}
                </p>
                <p>
                  <strong>End Date:</strong> {report.plantingEnd}
                </p>
                <p>
                  <strong>Harvest Amount (kg):</strong> {report.harvestAmount}
                </p>
                {report.plantImage && (
                  <div className="report-image">
                    <h4>Plant Picture:</h4>
                    <img
                      src={report.plantImage}
                      alt="Plant"
                      style={{ maxWidth: '200px' }}
                    />
                  </div>
                )}
              </div>
              <div className="column">
                <p>
                  <strong>Pesticide Used:</strong> {report.pesticideUsed}
                </p>
                <p>
                  <strong>Pesticide Amount (g):</strong> {report.pesticideAmount}
                </p>
                <p>
                  <strong>Fertilizer Used:</strong> {report.fertilizerUsed}
                </p>
                <p>
                  <strong>Fertilizer Amount (g):</strong> {report.fertilizerAmount}
                </p>
                <p>
                  <strong>Disease:</strong> {report.disease}
                </p>
                <p>
                  <strong>Current Price:</strong> RM {report.currentPrice}/kg
                </p>
              </div>
            </div>
            <div className="record-section">
              <div className="record-header">
                <div className="dots">
                  {Array(5).fill(null).map((_, i) => (
                    <span key={i} className="dot"></span>
                  ))}
                </div>
                <h3>Pesticide and Fertilizer Record</h3>
              </div>
              <div className="record-tables">
                <div className="record-table">
                  <h4>Pesticide</h4>
                  <div className="table-columns">
                    {report.pesticideColumns.map((column, colIndex) => (
                      <table key={colIndex}>
                        <thead>
                          <tr>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {column.length > 0 ? (
                            column.map((date, index) => (
                              <tr key={index}>
                                <td>{date}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td>No pesticide applications</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    ))}
                  </div>
                </div>
                <div className="record-table">
                  <h4>Fertilizer</h4>
                  <div className="table-columns">
                    {report.fertilizerColumns.map((column, colIndex) => (
                      <table key={colIndex}>
                        <thead>
                          <tr>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {column.length > 0 ? (
                            column.map((date, index) => (
                              <tr key={index}>
                                <td>{date}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td>No fertilizer applications</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="report-footer">
              <p>Harvest Hub</p>
            </div>
            <button className="print-button" onClick={handlePrint}>
              Print Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Report;