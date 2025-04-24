import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar, NavDropdown, Modal, Button, Form } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { auth, db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import './Sidebar.css';

const Sidebar = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [plantName, setPlantName] = useState('');
  const [creationDate, setCreationDate] = useState('');
  const [plantToRemove, setPlantToRemove] = useState(null);
  const [plantProfiles, setPlantProfiles] = useState([]);
  const [selectedPlantProfile, setSelectedPlantProfile] = useState({ name: 'Select Plant Profile', startDate: '' });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchPlantProfiles(currentUser.uid);
      } else {
        setPlantProfiles([]);
        setSelectedPlantProfile({ name: 'Select Plant Profile', startDate: '' });
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchPlantProfiles = async (userId) => {
    try {
      const profilesRef = collection(db, `users/${userId}/plantProfiles`);
      const snapshot = await getDocs(profilesRef);
      const profiles = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPlantProfiles(profiles);

      const selected = profiles.find((p) => p.isSelected) || profiles[0] || { name: 'Select Plant Profile', startDate: '' };
      setSelectedPlantProfile(selected);
    } catch (err) {
      console.error('Error fetching plant profiles:', err);
    }
  };

  const handleAddPlantProfile = async () => {
    if (plantName.trim() && creationDate && user) {
      try {
        const newProfile = { 
          name: plantName, 
          startDate: creationDate, 
          isSelected: plantProfiles.length === 0,
        };
        const profilesRef = collection(db, `users/${user.uid}/plantProfiles`);
        await addDoc(profilesRef, newProfile);
        setPlantName('');
        setCreationDate('');
        setShowAddModal(false);
        fetchPlantProfiles(user.uid);
      } catch (err) {
        console.error('Error adding plant profile:', err);
        alert('Failed to add plant profile.');
      }
    } else {
      alert('Please provide both a plant name and a creation date, and ensure you are logged in.');
    }
  };

  const handleRemovePlantProfile = async () => {
    if (plantToRemove && user) {
      try {
        const profileRef = doc(db, `users/${user.uid}/plantProfiles`, plantToRemove.id);
        await deleteDoc(profileRef);
        fetchPlantProfiles(user.uid);
        setPlantToRemove(null);
        setShowRemoveModal(false);
      } catch (err) {
        console.error('Error removing plant profile:', err);
        alert('Failed to remove plant profile.');
      }
    }
  };

  const handleSelectPlantProfile = async (profile) => {
    if (user) {
      try {
        const profilesRef = collection(db, `users/${user.uid}/plantProfiles`);
        const snapshot = await getDocs(profilesRef);

        const batch = writeBatch(db);
        snapshot.docs.forEach((doc) => {
          batch.update(doc.ref, { isSelected: doc.id === profile.id });
        });
        await batch.commit();

        setSelectedPlantProfile(profile);
        fetchPlantProfiles(user.uid);
      } catch (err) {
        console.error('Error selecting plant profile:', err);
        alert('Failed to select plant profile. Please try again.');
      }
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
              plantProfiles.map((profile) => (
                <NavDropdown.Item 
                  key={profile.id} 
                  onClick={() => handleSelectPlantProfile(profile)}
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
            Disease Detection
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
                {plantProfiles.map((profile) => (
                  <option key={profile.id} value={profile.name}>
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