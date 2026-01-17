import { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const ShiftForm = () => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    // REMOVED 'posted_by' from the initial state
    const [formData, setFormData] = useState({
        type: 'GIVE AWAY',
        location: '',
        shift_date: '',
        start_time: '',
        end_time: '',
    });
    const [status, setStatus] = useState({ type: '', msg: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/shifts/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                // The backend will now ignore any 'posted_by' we send or add it itself
                body: JSON.stringify(formData),
            });

            if (response.status === 401) {
                logout();
                return;
            }

            if (response.ok) {
                navigate('/');
            } else {
                setStatus({ type: 'danger', msg: 'Failed to post shift.' });
            }
        } catch (error) {
            setStatus({ type: 'danger', msg: 'No connection to server' });
        }
    };

    return (
        <Card className="shadow-sm border-0 mx-auto" style={{ maxWidth: '600px' }}>
            <Card.Body className="p-4">
                <Card.Title className="fw-bold text-primary mb-4">Post a New Shift</Card.Title>
                {status.msg && <Alert variant={status.type}>{status.msg}</Alert>}

                <Form onSubmit={handleSubmit}>
                    {/* ACTION TYPE */}
                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">SHIFT TYPE</Form.Label>
                        <Form.Select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option>GIVE AWAY</option>
                            <option>TRADE</option>
                            <option>PICK UP</option>
                        </Form.Select>
                    </Form.Group>

                    {/* LOCATION */}
                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">LOCATION</Form.Label>
                        <Form.Control
                            type="text" required
                            placeholder='Ex. Magic Kingdom ODV'
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                    </Form.Group>

                    {/* DATE */}
                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">DATE</Form.Label>
                        <Form.Control
                            type="date" required
                            value={formData.shift_date}
                            onChange={(e) => setFormData({ ...formData, shift_date: e.target.value })}
                        />
                    </Form.Group>

                    <Row>
                        <Col>
                            <Form.Group className="mb-4">
                                <Form.Label className="small fw-bold">START</Form.Label>
                                <Form.Control
                                    type="time" required
                                    value={formData.start_time}
                                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-4">
                                <Form.Label className="small fw-bold">END</Form.Label>
                                <Form.Control
                                    type="time" required
                                    value={formData.end_time}
                                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-grid gap-2">
                        <Button variant="primary" type="submit" size="lg" className="fw-bold">
                            Post Shift
                        </Button>
                        <Button variant="light" onClick={() => navigate('/')}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default ShiftForm;