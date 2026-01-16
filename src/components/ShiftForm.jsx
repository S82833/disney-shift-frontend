import { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';

const API_URL = import.meta.env.VITE_API_URL;

const ShiftForm = ({ onShiftCreated }) => {
    const [formData, setFormData] = useState({
        type: 'GIVE AWAY',
        location: 'Epcot - Park Greeter',
        shift_date: '',
        start_time: '',
        end_time: '',
        posted_by: ''
    });
    const [status, setStatus] = useState({ type: '', msg: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/shifts/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus({ type: 'success', msg: 'Shift posted successfully!' });
                onShiftCreated();
                setFormData({ ...formData, shift_date: '', start_time: '', end_time: '' });
            } else {
                setStatus({ type: 'danger', msg: 'Failed to post shift' });
            }
        } catch (error) {
            setStatus({ type: 'danger', msg: 'No connection to server' });
        }
    };

    return (
        <Card className="shadow-sm border-0 mb-4">
            <Card.Body>
                <Card.Title className="fw-bold text-primary">Post a Shift</Card.Title>
                <hr />
                {status.msg && <Alert variant={status.type}>{status.msg}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">Action</Form.Label>
                        <Form.Select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option>GIVE AWAY</option>
                            <option>TRADE</option>
                            <option>PICK UP</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">Posted By</Form.Label>
                        <Form.Control
                            type="text" required
                            placeholder="Your name (e.g., Simon)"
                            value={formData.posted_by}
                            onChange={(e) => setFormData({ ...formData, posted_by: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">Location</Form.Label>
                        <Form.Control
                            type="text" required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">Date</Form.Label>
                        <Form.Control
                            type="date" required
                            value={formData.shift_date}
                            onChange={(e) => setFormData({ ...formData, shift_date: e.target.value })}
                        />
                    </Form.Group>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">Starts</Form.Label>
                                <Form.Control
                                    type="time" required
                                    value={formData.start_time}
                                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">Ends</Form.Label>
                                <Form.Control
                                    type="time" required
                                    value={formData.end_time}
                                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button variant="primary" type="submit" className="w-100 fw-bold">
                        Post to App
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default ShiftForm;