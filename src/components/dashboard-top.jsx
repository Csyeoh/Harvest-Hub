import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Form, FormControl, Dropdown, Modal, Button, Form as BootstrapForm } from 'react-bootstrap';
import { auth, db } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './dashboard-top.css';
import CurrentWeather from './CurrentWeather';
import SoilStatus from './SoilStatus';
import axios from 'axios';

const TopNavbar = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', location: '' });
  const [newLocation, setNewLocation] = useState('');
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState('Penang');
  const navigate = useNavigate();

  const OPENWEATHERMAP_API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
  const GEOCODING_API_URL = 'http://api.openweathermap.org/geo/1.0/direct';
  const CURRENT_WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

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
          setLocation(location || 'Penang');
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError('Failed to fetch user data.');
        }
      }
    };
    fetchUserData();
  }, []);

  const fetchCurrentWeather = async (queryLocation) => {
    try {
      const geoResponse = await axios.get(GEOCODING_API_URL, {
        params: {
          q: queryLocation,
          limit: 1,
          appid: OPENWEATHERMAP_API_KEY,
        },
      });

      if (!geoResponse.data || geoResponse.data.length === 0) {
        throw new Error('Location not found. Please enter a valid city.');
      }

      const { lat, lon } = geoResponse.data[0];

      const response = await axios.get(CURRENT_WEATHER_API_URL, {
        params: {
          lat,
          lon,
          appid: OPENWEATHERMAP_API_KEY,
          units: 'metric',
        },
      });

      setWeatherData(response.data);
    } catch (err) {
      console.error('Error fetching current weather:', err.message);
      setError(`Failed to fetch current weather: ${err.message}. Please try again.`);
    }
  };

  useEffect(() => {
    if (OPENWEATHERMAP_API_KEY) {
      fetchCurrentWeather(location);
    }
  }, [location, OPENWEATHERMAP_API_KEY]);

  const handleUpdateLocation = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), { location: newLocation });
        setUserData(prev => ({ ...prev, location: newLocation }));
        setLocation(newLocation);
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

  const addNotification = useCallback((notification) => {
    console.log('addNotification type in TopNavbar:', typeof addNotification);
    console.log('Adding notification:', notification);
    setNotifications(prev => {
      if (notification.silent) {
        console.log('Silent notification, not adding to list:', notification);
        return prev;
      }
      const newNotifications = [...prev, notification];
      console.log('Updated notifications:', newNotifications);
      return newNotifications;
    });
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
  };

  const clearSoilNotifications = useCallback(() => {
    setNotifications(prev => {
      const filteredNotifications = prev.filter(n => !n.id.startsWith('dynamic-soil-'));
      console.log('Cleared soil notifications, remaining:', filteredNotifications);
      return filteredNotifications;
    });
  }, []);

  return (
    <div>
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
            <Dropdown className="mx-3 notification-dropdown">
              <Dropdown.Toggle 
                as={Nav.Link} 
                className="p-0 notification-toggle"
                variant="link"
              >
                <i className="bi bi-bell"></i>
                <span className="badge rounded-pill bg-danger notification-badge">
                  {notifications.length}
                  <span className="visually-hidden">unread notifications</span>
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu align="end" className="mt-2 notification-menu">
                <Dropdown.ItemText>Notification History</Dropdown.ItemText>
                <Dropdown.Divider />
                {notifications.length === 0 ? (
                  <Dropdown.ItemText>No notifications</Dropdown.ItemText>
                ) : (
                  <>
                    {notifications.map(notification => (
                      <Dropdown.Item key={notification.id} href={`#${notification.id}`}>
                        {notification.message} - {notification.timestamp}
                      </Dropdown.Item>
                    ))}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={clearNotifications}>
                      Clear Notifications
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>

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

      <CurrentWeather 
        weatherData={weatherData} 
        setWeatherData={setWeatherData} 
        location={location} 
        setLocation={setLocation} 
        addNotification={addNotification} 
      />
      <SoilStatus 
        addNotification={addNotification} 
        clearSoilNotifications={clearSoilNotifications} 
        weatherData={weatherData} 
      />
    </div>
  );
};

export default TopNavbar;