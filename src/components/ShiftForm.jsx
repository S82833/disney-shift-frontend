import { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const ShiftForm = () => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    // Get today's date in YYYY-MM-DD format to prevent past-date selection
    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        type: 'GIVE AWAY',
        location: '',
        shift_date: today,
        start_time: '',
        end_time: '',
    });

    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', msg: '' });

        // Validation: Prevent 0-minute shifts
        if (formData.start_time === formData.end_time) {
            setStatus({ type: 'danger', msg: 'Start and end times cannot be the same.' });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/shifts/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (response.status === 401) {
                logout();
                return;
            }

            if (response.ok) {
                // Success - go back to the board
                navigate('/');
            } else {
                const data = await response.json();
                setStatus({ type: 'danger', msg: data.detail || 'Failed to post shift.' });
            }
        } catch (error) {
            setStatus({ type: 'danger', msg: 'Connection error. Check if backend is running.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Card className="shadow-sm border-0 mx-auto" style={{ maxWidth: '600px' }}>
                <Card.Body className="p-4">
                    <div className="text-center mb-4">
                        <h3 className="fw-bold text-primary">Post a New Shift</h3>
                        <p className="text-muted small">Fill in the details for the shift you want to trade or give away.</p>
                    </div>

                    {status.msg && <Alert variant={status.type}>{status.msg}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        {/* SHIFT TYPE */}
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-muted text-uppercase">Shift Type</Form.Label>
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
                            <Form.Label className="small fw-bold text-muted text-uppercase">Work Location</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                placeholder="e.g. Epcot - Park Greeter"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </Form.Group>

                        {/* DATE */}
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-muted text-uppercase">Shift Date</Form.Label>
                            <Form.Control
                                type="date"
                                required
                                min={today} // Restricts the calendar to today onwards
                                value={formData.shift_date}
                                onChange={(e) => setFormData({ ...formData, shift_date: e.target.value })}
                            />
                        </Form.Group>

                        <Row>
                            <Col xs={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-bold text-muted text-uppercase">Start Time</Form.Label>
                                    <Form.Control
                                        type="time"
                                        required
                                        value={formData.start_time}
                                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-bold text-muted text-uppercase">End Time</Form.Label>
                                    <Form.Control
                                        type="time"
                                        required
                                        value={formData.end_time}
                                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-grid gap-2">
                            <Button
                                variant="primary"
                                type="submit"
                                size="lg"
                                className="fw-bold"
                                disabled={loading}
                            >
                                {loading ? 'Posting...' : 'Post Shift'}
                            </Button>
                            <Button variant="link" className="text-muted text-decoration-none" onClick={() => navigate('/')}>
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ShiftForm;