import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar, NavDropdown, Modal, Button, Form } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [plantName, setPlantName] = useState('');
  const [creationDate, setCreationDate] = useState(''); // New state for creation date
  const [plantToRemove, setPlantToRemove] = useState(null);
  const [plantProfiles, setPlantProfiles] = useState(() => {
    return JSON.parse(localStorage.getItem('plantProfiles') || '[]');
  });
  const [selectedPlantProfile, setSelectedPlantProfile] = useState(() => {
    const profile = localStorage.getItem('selectedPlantProfile');
    return profile ? JSON.parse(profile) : { name: 'Select Plant Profile', startDate: '' };
  });

  useEffect(() => {
    localStorage.setItem('plantProfiles', JSON.stringify(plantProfiles));
  }, [plantProfiles]);

  useEffect(() => {
    const handleStorageChange = () => {
      const profile = localStorage.getItem('selectedPlantProfile');
      setSelectedPlantProfile(profile ? JSON.parse(profile) : { name: 'Select Plant Profile', startDate: '' });
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleAddPlantProfile = () => {
    if (plantName.trim() && creationDate) {
      const newProfile = { name: plantName, startDate: creationDate };
      setPlantProfiles(prev => [...prev, newProfile]);
      setPlantName('');
      setCreationDate(''); // Reset creation date
      setShowAddModal(false);
    } else {
      alert('Please provide both a plant name and a creation date.');
    }
  };

  const handleRemovePlantProfile = () => {
    if (plantToRemove) {
      setPlantProfiles(prev => {
        const updatedProfiles = prev.filter(profile => profile.name !== plantToRemove.name);
        if (selectedPlantProfile.name === plantToRemove.name) {
          const newSelected = { name: 'Select Plant Profile', startDate: '' };
          localStorage.setItem('selectedPlantProfile', JSON.stringify(newSelected));
          setSelectedPlantProfile(newSelected);
        }
        return updatedProfiles;
      });
      setPlantToRemove(null);
      setShowRemoveModal(false);
    }
  };

  return (
    <div className="sidebar-container">
      <Navbar 
        bg="dark" 
        variant="dark" 
        className="flex-column h-100 sidebar"
      >
        <Navbar.Brand as={Link} to="/" className="mb-4">
          <img src="../hhbot.svg" alt="hhbot" className="profile-img"/>
          Harvest Hub
        </Navbar.Brand>

        <Nav className="flex-column w-100">
          <NavDropdown 
            title={
              <span>
                <i className="bi bi-flower1 me-2"></i>
                {selectedPlantProfile.name}
              </span>
            }
            id="plant-profile-dropdown"
            className="mb-2 plant-profile-dropdown"
          >
            {plantProfiles.length > 0 ? (
              plantProfiles.map((profile, index) => (
                <NavDropdown.Item 
                  key={index} 
                  onClick={() => {
                    localStorage.setItem('selectedPlantProfile', JSON.stringify(profile));
                    setSelectedPlantProfile(profile);
                  }}
                >
                  {profile.name} (Created: {profile.startDate})
                </NavDropdown.Item>
              ))
            ) : (
              <NavDropdown.Item disabled>No profiles added</NavDropdown.Item>
            )}
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={() => setShowAddModal(true)}>
              Add Plant Profile
            </NavDropdown.Item>
            <NavDropdown.Item 
              onClick={() => {
                if (plantProfiles.length > 0) setShowRemoveModal(true);
              }}
              disabled={plantProfiles.length === 0}
            >
              Remove Plant Profile
            </NavDropdown.Item>
          </NavDropdown>
          
          <NavLink to="/dashboard" className="nav-link mb-2" end>
            <i className="bi bi-house-door-fill me-2"></i>
            Dashboard
          </NavLink>
          <NavLink to="/dashboard/crop-cultivation" className="nav-link mb-2">
            <i className="bi bi-search me-2"></i>
            Crop Cultivation
          </NavLink>
          <NavLink to="/dashboard/calendar" className="nav-link mb-2">
            <i className="bi bi-calendar3 me-2"></i>
            Calendar
          </NavLink>
          <NavLink to="/dashboard/chat" className="nav-link mb-2">
            <i className="bi bi-chat-dots me-2"></i>
            Chat Assistant
          </NavLink>
          <NavLink to="/dashboard/farm-report" className="nav-link mb-2">
            <i className="bi bi-clipboard-data me-2"></i>
            Farm Report
          </NavLink>
          <NavLink to="/dashboard/settings" className="nav-link mt-auto">
            <i className="bi bi-gear me-2"></i>
            Settings
          </NavLink>
        </Nav>
      </Navbar>

      {/* Modal for Adding Plant Profile */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Plant Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="plantName">
              <Form.Label>Plant Name</Form.Label>
              <Form.Control
                type="text"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                placeholder="e.g., Tomato"
                required
              />
            </Form.Group>
            <Form.Group controlId="creationDate" className="mt-3">
              <Form.Label>Creation Date</Form.Label>
              <Form.Control
                type="date"
                value={creationDate}
                onChange={(e) => setCreationDate(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddPlantProfile}>
            Add Profile
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Removing Plant Profile */}
      <Modal show={showRemoveModal} onHide={() => setShowRemoveModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Remove Plant Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="plantToRemove">
              <Form.Label>Select Plant Profile to Remove</Form.Label>
              <Form.Select
                value={plantToRemove?.name || ''}
                onChange={(e) => {
                  const selected = plantProfiles.find(p => p.name === e.target.value);
                  setPlantToRemove(selected || null);
                }}
              >
                <option value="">Select a profile</option>
                {plantProfiles.map((profile, index) => (
                  <option key={index} value={profile.name}>
                    {profile.name} (Created: {profile.startDate})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
          {plantToRemove && (
            <p className="mt-3">
              Are you sure you want to remove "{plantToRemove.name}" created on {plantToRemove.startDate}?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRemoveModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleRemovePlantProfile}
            disabled={!plantToRemove}
          >
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Sidebar;