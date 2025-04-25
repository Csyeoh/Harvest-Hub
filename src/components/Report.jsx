import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { auth, db } from '../components/firebase';
import { collection, doc, getDoc, addDoc, onSnapshot } from 'firebase/firestore';
import { fetchMarketData } from '../../geminiClient';
import './Report.css';

function Report() {
  const [loggedInFarmer, setLoggedInFarmer] = useState('Loading...');
  const [currentPrice, setCurrentPrice] = useState('RM50.00/kg');
  const [selectedPlantProfile, setSelectedPlantProfile] = useState({ name: 'Not selected', startDate: '', id: '' });
  const [formData, setFormData] = useState({
    plantingEnd: '',
    harvestAmount: '',
    disease: '',
  });
  const [report, setReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const reportRef = useRef();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        // Fetch farmer's name from auth displayName
        const displayName = user.displayName || 'Unknown Farmer';
        setLoggedInFarmer(displayName);

        // Fetch current plant profile
        const profilesRef = collection(db, `users/${user.uid}/plantProfiles`);
        const unsubscribeSnapshot = onSnapshot(profilesRef, (snapshot) => {
          const profiles = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          const selectedProfile = profiles.find((p) => p.isSelected) || { 
            name: 'Not selected', 
            startDate: '',
            id: ''
          };
          setSelectedPlantProfile({
            name: selectedProfile.name,
            startDate: selectedProfile.startDate,
            id: selectedProfile.id
          });
        }, (err) => {
          console.error('Error listening to plant profiles:', err);
          setSelectedPlantProfile({ name: 'Not selected', startDate: '', id: '' });
        });

        return () => unsubscribeSnapshot();
      } else {
        setLoggedInFarmer('Unknown Farmer');
        setSelectedPlantProfile({ name: 'Not selected', startDate: '', id: '' });
        setCurrentPrice('RM50.00/kg');
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const updateMarketPrice = async () => {
      if (selectedPlantProfile.name && selectedPlantProfile.name !== 'Not selected') {
        try {
          const marketData = await fetchMarketData(selectedPlantProfile.name);
          setCurrentPrice(`RM${marketData.price}/kg`);
        } catch (err) {
          console.error('Error fetching market price:', err);
          setCurrentPrice('RM50.00/kg');
        }
      } else {
        setCurrentPrice('RM50.00/kg');
      }
    };
    updateMarketPrice();
  }, [selectedPlantProfile.name]);

  useEffect(() => {
    if (user) {
      const reportsRef = collection(db, `users/${user.uid}/reports`);
      const unsubscribe = onSnapshot(reportsRef, (snapshot) => {
        const fetchedReports = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReports(fetchedReports);
      }, (err) => {
        console.error('Error fetching reports:', err);
        setReports([]);
      });
      return () => unsubscribe();
    } else {
      setReports([]);
    }
  }, [user]);

  const fetchCalendarDataInRange = useCallback(async (startDate, endDate, plantProfileId) => {
    if (!startDate || !endDate || !user || !plantProfileId) {
      return { pesticideDates: [], fertilizerDates: [], images: [], totalPesticideAmount: 0, totalFertilizerAmount: 0 };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const pesticideDates = [];
    const fertilizerDates = [];
    const images = [];
    let totalPesticideAmount = 0;
    let totalFertilizerAmount = 0;

    let current = new Date(start);
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0]; // YYYY-MM-DD
      const calendarDocRef = doc(db, `users/${user.uid}/plantProfiles/${plantProfileId}/calendar`, dateStr);
      
      try {
        const docSnap = await getDoc(calendarDocRef);
        if (docSnap.exists()) {
          const dailyData = docSnap.data();
          if (dailyData.pesticide) {
            pesticideDates.push({
              date: dateStr,
              type: dailyData.pesticideType || 'Not specified',
              amount: dailyData.pesticideAmount || 0,
            });
            totalPesticideAmount += Number(dailyData.pesticideAmount) || 0;
          }
          if (dailyData.fertilizer) {
            fertilizerDates.push({
              date: dateStr,
              type: dailyData.fertilizerType || 'Not specified',
              amount: dailyData.fertilizerAmount || 0,
            });
            totalFertilizerAmount += Number(dailyData.fertilizerAmount) || 0;
          }
          if (dailyData.image) {
            images.push({
              date: dateStr,
              url: dailyData.image,
            });
          }
        }
      } catch (err) {
        console.error(`Error fetching calendar data for ${dateStr}:`, err);
      }
      current.setDate(current.getDate() + 1);
    }

    return { pesticideDates, fertilizerDates, images, totalPesticideAmount, totalFertilizerAmount };
  }, [user]);

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

  const handleSaveReport = async (e) => {
    e.preventDefault();
    if (!selectedPlantProfile.startDate || !selectedPlantProfile.id) {
      alert('Please select a plant profile from the sidebar.');
      return;
    }
    alert('Saving report...');
    const { pesticideDates, fertilizerDates, images, totalPesticideAmount, totalFertilizerAmount } = await fetchCalendarDataInRange(
      selectedPlantProfile.startDate,
      formData.plantingEnd,
      selectedPlantProfile.id
    );

    const newReport = {
      farmerName: loggedInFarmer,
      plant: selectedPlantProfile.name,
      plantingStart: selectedPlantProfile.startDate,
      plantingEnd: formData.plantingEnd,
      harvestAmount: formData.harvestAmount,
      disease: formData.disease,
      currentPrice,
      pesticideDates, // Store flat array instead of columns
      fertilizerDates, // Store flat array instead of columns
      imagesInRange: images,
      totalPesticideAmount,
      totalFertilizerAmount,
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, `users/${user.uid}/reports`), newReport);
      alert('Report saved successfully!');
      setFormData({ plantingEnd: '', harvestAmount: '', disease: '' });
    } catch (err) {
      console.error('Error saving report:', err);
      alert('Failed to save report.');
    }
  };

  const handlePrintReport = async (e) => {
    e.preventDefault();
    if (!selectedPlantProfile.startDate || !selectedPlantProfile.id) {
      alert('Please select a plant profile from the sidebar.');
      return;
    }
    const { pesticideDates, fertilizerDates, images, totalPesticideAmount, totalFertilizerAmount } = await fetchCalendarDataInRange(
      selectedPlantProfile.startDate,
      formData.plantingEnd,
      selectedPlantProfile.id
    );
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
      pesticideColumns, // Use columns for display only
      fertilizerColumns, // Use columns for display only
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

  const handleViewReport = (report) => {
    // Convert pesticideDates and fertilizerDates to columns for display
    const updatedReport = {
      ...report,
      pesticideColumns: splitIntoColumns(report.pesticideDates || []),
      fertilizerColumns: splitIntoColumns(report.fertilizerDates || [])
    };
    setSelectedReport(updatedReport);
    setShowReportModal(true);
  };

  const handleBackToList = () => {
    setSelectedReport(null);
    setShowReportModal(false);
  };

  return (
    <div className='dashboard-content'>
      <h1>Farm Report</h1>
      <div className='report-tabs'>
        <button
          className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create Farm Report
        </button>
        <button
          className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          View Farm Reports
        </button>
      </div>
      {activeTab === 'create' && (
        <div className='farm-report-container'>
          <div className='report-form'>
            <h3>Create Farm Report</h3>
            <form>
              <div className='form-group'>
                <label>Farmer's Name:</label>
                <input
                  type='text'
                  value={loggedInFarmer}
                  disabled
                  placeholder='Autofilled from profile'
                />
              </div>
              <div className='form-group'>
                <label>Plant:</label>
                <input
                  type='text'
                  value={selectedPlantProfile.name}
                  disabled
                  placeholder='From selected profile'
                />
              </div>
              <div className='form-group'>
                <label>Planting Start Date:</label>
                <input
                  type='date'
                  value={selectedPlantProfile.startDate}
                  disabled
                  placeholder='From selected profile'
                />
              </div>
              <div className='form-group'>
                <label>Planting End Date:</label>
                <input
                  type='date'
                  value={formData.plantingEnd}
                  onChange={(e) => setFormData(prev => ({ ...prev, plantingEnd: e.target.value }))}
                  required
                />
              </div>
              <div className='form-group'>
                <label>Harvest Amount (kg):</label>
                <input
                  type='number'
                  value={formData.harvestAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, harvestAmount: e.target.value }))}
                  placeholder='e.g., 100'
                  required
                />
              </div>
              <div className='form-group'>
                <label>Disease:</label>
                <input
                  type='text'
                  value={formData.disease}
                  onChange={(e) => setFormData(prev => ({ ...prev, disease: e.target.value }))}
                  placeholder='e.g., None'
                  required
                />
              </div>
              <div className='form-group'>
                <label>Current Price (RM /kg):</label>
                <input
                  type='text'
                  value={currentPrice}
                  disabled
                  placeholder='From market data'
                />
              </div>
              <div className='button-group'>
                <button type='submit' onClick={handleSaveReport}>Save Report</button>
                <button type='submit' onClick={handlePrintReport}>Print Report</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {activeTab === 'view' && (
        <div className='farm-report-container'>
          <div className='report-list'>
            <h3>View Farm Reports</h3>
            {reports.length === 0 ? (
              <p>No reports available.</p>
            ) : (
              <ul>
                {reports.map((report) => (
                  <li
                    key={report.id}
                    className='report-item'
                    onClick={() => handleViewReport(report)}
                  >
                    <span>{report.plant} - {report.plantingEnd}</span>
                    <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      <Modal
        show={showReportModal}
        onHide={selectedReport ? handleBackToList : () => setShowReportModal(false)}
        centered
        dialogClassName='report-modal'
      >
        <Modal.Header closeButton>
          <Modal.Title>Farm Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {(report || selectedReport) && (
            <div className='report-display' ref={reportRef}>
              <h2>FARM REPORT</h2>
              <div className='report-header-line'></div>
              <div className='report-details'>
                <div className='column'>
                  <p><strong>Farmer's Name:</strong> {(report ||

 selectedReport).farmerName}</p>
                  <p><strong>Plant:</strong> {(report || selectedReport).plant}</p>
                  <p><strong>Start Date:</strong> {(report || selectedReport).plantingStart}</p>
                  <p><strong>End Date:</strong> {(report || selectedReport).plantingEnd}</p>
                  <p><strong>Harvest Amount (kg):</strong> {(report || selectedReport).harvestAmount}</p>
                </div>
                <div className='column'>
                  <p><strong>Total Pesticide Amount (g):</strong> {(report || selectedReport).totalPesticideAmount}</p>
                  <p><strong>Total Fertilizer Amount (g):</strong> {(report || selectedReport).totalFertilizerAmount}</p>
                  <p><strong>Disease:</strong> {(report || selectedReport).disease}</p>
                  <p><strong>Current Price:</strong> {(report || selectedReport).currentPrice}</p>
                </div>
              </div>
              <div className='record-section'>
                <div className='record-header'>
                  <div className='dots'>
                    {Array(5).fill(null).map((_, i) => (
                      <span key={i} className='dot'></span>
                    ))}
                  </div>
                  <h3>Pesticide and Fertilizer Record</h3>
                </div>
                <div className='record-tables'>
                  <div className='record-table'>
                    <h4>Pesticide</h4>
                    <div className='table-columns'>
                      {(report || selectedReport).pesticideColumns.map((column, colIndex) => (
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
                                <td colSpan='3'>No pesticide applications</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      ))}
                    </div>
                  </div>
                  <div className='record-table'>
                    <h4>Fertilizer</h4>
                    <div className='table-columns'>
                      {(report || selectedReport).fertilizerColumns.map((column, colIndex) => (
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
                                <td colSpan='3'>No fertilizer applications</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {(report || selectedReport).imagesInRange.length > 0 && (
                <div className='record-section'>
                  <div className='record-header'>
                    <div className='dots'>
                      {Array(5).fill(null).map((_, i) => (
                        <span key={i} className='dot'></span>
                      ))}
                    </div>
                    <h3>Uploaded Images</h3>
                  </div>
                  <div className='image-gallery'>
                    {(report || selectedReport).imagesInRange.map((img, index) => (
                      <div key={index} className='gallery-item'>
                        <div className='image-wrapper'>
                          <img src={img.url} alt={`Image for ${img.date}`} />
                        </div>
                        <p>{img.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className='report-footer'>
                <img src='../hhbot.svg' alt='Harvest Hub Logo' className='footer-logo-inline' />
                <span>Harvest Hub</span>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedReport && (
            <Button variant='secondary' onClick={handleBackToList}>
              Back
            </Button>
          )}
          <Button variant='secondary' onClick={selectedReport ? handleBackToList : () => setShowReportModal(false)}>
            Close
          </Button>
          <Button variant='primary' onClick={handlePrint}>
            Print Report
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Report;