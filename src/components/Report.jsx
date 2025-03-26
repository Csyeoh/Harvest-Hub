import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { auth } from '../components/firebase';
import './Report.css';

function Report() {
  const [loggedInFarmer, setLoggedInFarmer] = useState('Loading...');
  const [currentPrice] = useState('RM2.50/kg');
  const [selectedPlantProfile, setSelectedPlantProfile] = useState(() => {
    const profile = localStorage.getItem('selectedPlantProfile');
    return profile ? JSON.parse(profile) : { name: 'Not selected', startDate: '' };
  });
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('reportFormData');
    return savedData ? JSON.parse(savedData) : {
      plantingEnd: '',
      harvestAmount: '',
      disease: '',
    };
  });
  const [report, setReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const reportRef = useRef();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setLoggedInFarmer(user.displayName || 'Unknown Farmer');
      } else {
        setLoggedInFarmer('Unknown Farmer');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('reportFormData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    const handleStorageChange = () => {
      const profile = localStorage.getItem('selectedPlantProfile');
      const newProfile = profile ? JSON.parse(profile) : { name: 'Not selected', startDate: '' };
      setSelectedPlantProfile(newProfile);
      if (report) {
        const { pesticideDates, fertilizerDates, images, totalPesticideAmount, totalFertilizerAmount } = fetchCalendarDataInRange(newProfile.startDate, report.plantingEnd);
        const pesticideColumns = splitIntoColumns(pesticideDates);
        const fertilizerColumns = splitIntoColumns(fertilizerDates);
        setReport({
          ...report,
          plant: newProfile.name,
          plantingStart: newProfile.startDate,
          pesticideColumns,
          fertilizerColumns,
          imagesInRange: images,
          totalPesticideAmount,
          totalFertilizerAmount,
        });
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [report]);

  const fetchCalendarDataInRange = (startDate, endDate) => {
    if (!startDate || !endDate) return { pesticideDates: [], fertilizerDates: [], images: [], totalPesticideAmount: 0, totalFertilizerAmount: 0 };
    const start = new Date(startDate);
    const end = new Date(endDate);
    const pesticideDates = [];
    const fertilizerDates = [];
    const images = [];
    let totalPesticideAmount = 0;
    let totalFertilizerAmount = 0;

    let current = new Date(start);
    while (current <= end) {
      const year = current.getFullYear();
      const month = current.getMonth();
      const day = current.getDate();
      const key = `dailyData_${year}_${month}`;
      const dailyData = localStorage.getItem(key);
      if (dailyData) {
        const parsedData = JSON.parse(dailyData);
        const dateStr = current.toISOString().split('T')[0];
        if (parsedData[day]?.pesticide) {
          pesticideDates.push({
            date: dateStr,
            type: parsedData[day].pesticideType || 'Not specified',
            amount: parsedData[day].pesticideAmount || 0,
          });
          totalPesticideAmount += Number(parsedData[day].pesticideAmount) || 0;
        }
        if (parsedData[day]?.fertilizer) {
          fertilizerDates.push({
            date: dateStr,
            type: parsedData[day].fertilizerType || 'Not specified',
            amount: parsedData[day].fertilizerAmount || 0,
          });
          totalFertilizerAmount += Number(parsedData[day].fertilizerAmount) || 0;
        }
        if (parsedData[day]?.image) {
          images.push({
            date: dateStr,
            url: parsedData[day].image,
          });
        }
      }
      current.setDate(current.getDate() + 1);
    }

    return { pesticideDates, fertilizerDates, images, totalPesticideAmount, totalFertilizerAmount };
  };

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

    return columns;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPlantProfile.startDate) {
      alert('Please select a plant profile from the sidebar.');
      return;
    }
    const { pesticideDates, fertilizerDates, images, totalPesticideAmount, totalFertilizerAmount } = fetchCalendarDataInRange(selectedPlantProfile.startDate, formData.plantingEnd);
    const pesticideColumns = splitIntoColumns(pesticideDates);
    const fertilizerColumns = splitIntoColumns(fertilizerDates);

    const newReport = {
      farmerName: loggedInFarmer,
      plant: selectedPlantProfile.name,
      plantingStart: selectedPlantProfile.startDate,
      plantingEnd: formData.plantingEnd,
      harvestAmount: formData.harvestAmount,
      disease: formData.disease,
      currentPrice,
      pesticideColumns,
      fertilizerColumns,
      imagesInRange: images,
      totalPesticideAmount,
      totalFertilizerAmount,
    };

    setReport(newReport);
    setShowReportModal(true);
  };

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
        <div className="report-form">
          <h3>Create Farm Report</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Farmer's Name:</label>
              <input
                type="text"
                value={loggedInFarmer}
                disabled
                placeholder="Autofilled from login"
              />
            </div>
            <div className="form-group">
              <label>Plant:</label>
              <input
                type="text"
                value={selectedPlantProfile.name}
                disabled
                placeholder="Select from Sidebar"
              />
            </div>
            <div className="form-group">
              <label>Planting Start Date:</label>
              <input
                type="date"
                value={selectedPlantProfile.startDate}
                disabled
                placeholder="From selected profile"
              />
            </div>
            <div className="form-group">
              <label>Planting End Date:</label>
              <input
                type="date"
                value={formData.plantingEnd}
                onChange={(e) => setFormData(prev => ({ ...prev, plantingEnd: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label>Harvest Amount (kg):</label>
              <input
                type="number"
                value={formData.harvestAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, harvestAmount: e.target.value }))}
                placeholder="e.g., 100"
                required
              />
            </div>
            <div className="form-group">
              <label>Disease:</label>
              <input
                type="text"
                value={formData.disease}
                onChange={(e) => setFormData(prev => ({ ...prev, disease: e.target.value }))}
                placeholder="e.g., None"
                required
              />
            </div>
            <div className="form-group">
              <label>Current Price (RM /kg):</label>
              <input
                type="text"
                value={currentPrice}
                disabled
                placeholder="Autofilled later"
              />
            </div>
            <button type="submit">Generate Report</button>
          </form>
        </div>

        <Modal 
          show={showReportModal} 
          onHide={() => setShowReportModal(false)} 
          size="lg" 
          centered
          dialogClassName="report-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Farm Report</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {report && (
              <div className="report-display" ref={reportRef}>
                <h2>FARM REPORT</h2>
                <div className="report-header-line"></div>
                <div className="report-details">
                  <div className="column">
                    <p><strong>Farmer's Name:</strong> {report.farmerName}</p>
                    <p><strong>Plant:</strong> {report.plant}</p>
                    <p><strong>Start Date:</strong> {report.plantingStart}</p>
                    <p><strong>End Date:</strong> {report.plantingEnd}</p>
                    <p><strong>Harvest Amount (kg):</strong> {report.harvestAmount}</p>
                  </div>
                  <div className="column">
                    <p><strong>Total Pesticide Amount (g):</strong> {report.totalPesticideAmount}</p>
                    <p><strong>Total Fertilizer Amount (g):</strong> {report.totalFertilizerAmount}</p>
                    <p><strong>Disease:</strong> {report.disease}</p>
                    <p><strong>Current Price:</strong> {report.currentPrice}</p>
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
                                <th>Type</th>
                                <th>Amount (g)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {column.length > 0 ? (
                                column.map((entry, index) => (
                                  <tr key={index}>
                                    <td>{entry.date}</td>
                                    <td>{entry.type}</td>
                                    <td>{entry.amount}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="3">No pesticide applications</td>
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
                                <th>Type</th>
                                <th>Amount (g)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {column.length > 0 ? (
                                column.map((entry, index) => (
                                  <tr key={index}>
                                    <td>{entry.date}</td>
                                    <td>{entry.type}</td>
                                    <td>{entry.amount}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="3">No fertilizer applications</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {report.imagesInRange.length > 0 && (
                  <div className="record-section">
                    <div className="record-header">
                      <div className="dots">
                        {Array(5).fill(null).map((_, i) => (
                          <span key={i} className="dot"></span>
                        ))}
                      </div>
                      <h3>Uploaded Images</h3>
                    </div>
                    <div className="image-gallery">
                      {report.imagesInRange.map((img, index) => (
                        <div key={index} className="gallery-item">
                          <div className="image-wrapper">
                            <img src={img.url} alt={`Image for ${img.date}`} />
                          </div>
                          <p>{img.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="report-footer">
                  <img src="../hhbot.svg" alt="Harvest Hub Logo" className="footer-logo-inline" />
                  <span>Harvest Hub</span>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowReportModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handlePrint}>
              Print Report
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default Report;