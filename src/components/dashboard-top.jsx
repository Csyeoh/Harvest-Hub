import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Form, FormControl, Dropdown, Modal, Button, Form as BootstrapForm } from 'react-bootstrap';
import { auth, db } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './dashboard-top.css';

const TopNavbar = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', location: '' });
  const [newLocation, setNewLocation] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const name = user.displayName || 'Unknown';
        const email = user.email || 'No email';
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const location = userDoc.exists() ? userDoc.data().location || '' : '';
          setUserData({ name, email, location });
          setNewLocation(location);
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError('Failed to fetch user data.');
        }
      }
    };
    fetchUserData();
  }, []);

  const handleUpdateLocation = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          location: newLocation,
        });
        setUserData(prev => ({ ...prev, location: newLocation }));
        setShowProfileModal(false);
      } catch (err) {
        console.error('Error updating location:', err);
        setError('Failed to update location.');
      }
    }
  };

  const handleSettingsNavigation = () => {
    navigate('/dashboard/settings');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Error logging out:', err);
      setError('Failed to log out. Please try again.');
    }
  };

  return (
    <Navbar bg="dark" variant="dark" fixed="top" className="top-navbar">
      <div className="container-fluid justify-content-center">
        <div style={{ width: '250px' }}></div>
        <Form className="d-flex mx-auto search-form">
          <FormControl
            type="search"
            placeholder="Search farm data..."
            className="me-2"
            aria-label="Search"
          />
        </Form>
        <Nav className="ms-auto align-items-center">
          {/* Email Icon */}
          <Nav.Link
            href={`mailto:${userData.email}`}
            className="mx-3 email-icon"
            title="Open Mailbox"
          >
            <i className="bi bi-envelope"></i>
          </Nav.Link>
          {/* Translation Button with Dropdown */}
          <Dropdown className="mx-3 translation-dropdown">
            <Dropdown.Toggle
              as={Nav.Link}
              className="p-0 translation-toggle"
              variant="link"
            >
              <i className="bi bi-globe"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="mt-2 translation-menu">
              <Dropdown.ItemText>Select Language</Dropdown.ItemText>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => console.log('Selected English')}>
                English
              </Dropdown.Item>
              <Dropdown.Item onClick={() => console.log('Selected Spanish')}>
                Spanish
              </Dropdown.Item>
              <Dropdown.Item onClick={() => console.log('Selected French')}>
                French
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {/* Profile Dropdown with Image */}
          <Dropdown align="end" className="mx-3">
            <Dropdown.Toggle
              as={Nav.Link}
              className="profile-dropdown p-0"
              variant="link"
            >
              <img
                src="../hhbot.svg"
                alt="Profile"
                className="profile-img"
              />
            </Dropdown.Toggle>
            <Dropdown.Menu className="mt-2">
              <Dropdown.Item onClick={() => setShowProfileModal(true)}>
                Profile
              </Dropdown.Item>
              <Dropdown.Item onClick={handleSettingsNavigation}>
                Settings
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </div>
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>User Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <p className="text-danger">{error}</p>}
          <BootstrapForm>
            <BootstrapForm.Group className="mb-3">
              <BootstrapForm.Label>Name</BootstrapForm.Label>
              <BootstrapForm.Control
                type="text"
                value={userData.name}
                disabled
              />
            </BootstrapForm.Group>
            <BootstrapForm.Group className="mb-3">
              <BootstrapForm.Label>Email</BootstrapForm.Label>
              <BootstrapForm.Control
                type="email"
                value={userData.email}
                disabled
              />
            </BootstrapForm.Group>
            <BootstrapForm.Group className="mb-3">
              <BootstrapForm.Label>Location</BootstrapForm.Label>
              <BootstrapForm.Control
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Enter your location"
              />
            </BootstrapForm.Group>
          </BootstrapForm>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateLocation}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Navbar>
  );
};

export default TopNavbar;