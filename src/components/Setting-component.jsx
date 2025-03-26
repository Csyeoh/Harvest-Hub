import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Row, Col, Nav, Button, ListGroup, Modal, Form } from 'react-bootstrap';
import { auth } from '../components/firebase'; // Import Firebase auth
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'; // Import necessary Firebase functions
import './Setting-component.css';

const SettingsComp = () => {
  const [activeTab, setActiveTab] = useState('devices');
  const [devices, setDevices] = useState([
    { name: 'Laptop', description: 'Work laptop' },
    { name: 'Phone', description: 'Personal phone' },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [deviceToRemove, setDeviceToRemove] = useState(null);
  const [newDevice, setNewDevice] = useState({ name: '', description: '' });
  const [currentPassword, setCurrentPassword] = useState(''); // State for current password
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const appVersion = '1.0.0';

  const handleAddDevice = () => {
    if (newDevice.name.trim()) {
      setDevices([...devices, newDevice]);
      setNewDevice({ name: '', description: '' });
      setShowAddModal(false);
    }
  };

  const confirmRemoveDevice = (index) => {
    setDeviceToRemove(index);
    setShowRemoveModal(true);
  };

  const handleRemoveDevice = () => {
    setDevices(devices.filter((_, i) => i !== deviceToRemove));
    setShowRemoveModal(false);
    setDeviceToRemove(null);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords
    if (password !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    if (!currentPassword) {
      setError('Please enter your current password.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        setError('No user is currently signed in.');
        return;
      }

      // Reauthenticate the user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update the password
      await updatePassword(user, password);
      setSuccess('Password updated successfully!');
      setCurrentPassword('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Error during password update:', err);
      if (err.code === 'auth/wrong-password') {
        setError('Current password is incorrect.');
      } else if (err.code === 'auth/weak-password') {
        setError('New password is too weak. Please choose a stronger password.');
      } else if (err.code === 'auth/requires-recent-login') {
        setError('This operation requires recent authentication. Please log out and log in again.');
      } else {
        setError('Failed to update password. Please try again.');
      }
    }
  };

  return (
    <Container fluid className="p-0">
      <Row className="m-0 justify-content-center">
        <Col md={8} className="settings-container">
          {/* Settings Navigation (Side Navbar) */}
          <Nav className="settings-nav" variant="pills" activeKey={activeTab}>
            <Nav.Item>
              <Nav.Link
                eventKey="devices"
                onClick={() => setActiveTab('devices')}
                className={activeTab === 'devices' ? 'active' : ''}
              >
                Device
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="security"
                onClick={() => setActiveTab('security')}
                className={activeTab === 'security' ? 'active' : ''}
              >
                Security
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="version"
                onClick={() => setActiveTab('version')}
                className={activeTab === 'version' ? 'active' : ''}
              >
                Version
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {/* Settings Content */}
          <div className="settings-content">
            {activeTab === 'devices' && (
              <div>
                <h2>Device List</h2>
                <Button variant="primary" className="mb-3" onClick={() => setShowAddModal(true)}>
                  Add Device
                </Button>
                <ListGroup className="device-list">
                  {devices.map((device, index) => (
                    <ListGroup.Item
                      key={index}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{device.name}</strong>
                        <p className="mb-0 text-muted">{device.description}</p>
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => confirmRemoveDevice(index)}
                      >
                        Remove
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2>Security</h2>
                {error && <p className="text-danger">{error}</p>}
                {success && <p className="text-success">{success}</p>}
                <Form onSubmit={handlePasswordChange}>
                  <Form.Group className="mb-3" controlId="currentPassword">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="newPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="confirmPassword">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Update Password
                  </Button>
                </Form>
              </div>
            )}

            {activeTab === 'version' && (
              <div>
                <h2>Version</h2>
                <p>
                  Current Version: <strong>{appVersion}</strong>
                </p>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {/* Add Device Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Device</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="deviceName">
              <Form.Label>Device Name</Form.Label>
              <Form.Control
                type="text"
                value={newDevice.name}
                onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                placeholder="Enter device name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="deviceDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newDevice.description}
                onChange={(e) => setNewDevice({ ...newDevice, description: e.target.value })}
                placeholder="Enter device description"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddDevice}>
            Add Device
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Remove Device Confirmation Modal */}
      <Modal show={showRemoveModal} onHide={() => setShowRemoveModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Removal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove{' '}
          {deviceToRemove !== null && <strong>{devices[deviceToRemove]?.name}</strong>}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRemoveModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleRemoveDevice}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SettingsComp;