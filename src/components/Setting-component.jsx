// src/components/Settings.jsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import { Container, Row, Col, Nav, Button, ListGroup, Modal, Form } from 'react-bootstrap';
import './Setting-component.css'

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
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
  
    const handlePasswordChange = (e) => {
      e.preventDefault();
      if (password === confirmPassword && password.length >= 6) {
        alert('Password updated successfully!');
        setPassword('');
        setConfirmPassword('');
      } else {
        alert('Passwords must match and be at least 6 characters long.');
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
                  <Form onSubmit={handlePasswordChange}>
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
                      <Form.Label>Confirm Password</Form.Label>
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