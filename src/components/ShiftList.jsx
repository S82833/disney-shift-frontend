import { useEffect, useState } from 'react';
import { Card, Badge, Row, Col, Spinner, Modal, Button, Form } from 'react-bootstrap';

const API_URL = import.meta.env.VITE_API_URL;

const ShiftList = ({ refreshTrigger }) => {
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);

    // States for Editing
    const [showModal, setShowModal] = useState(false);
    const [selectedShift, setSelectedShift] = useState(null);

    const fetchShifts = () => {
        setLoading(true);
        fetch(`${API_URL}/shifts/`)
            .then(res => res.json())
            .then(data => {
                setShifts(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchShifts();
    }, [refreshTrigger]);

    const handleCardClick = (shift) => {
        setSelectedShift(shift);
        setShowModal(true);
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`${API_URL}/shifts/${selectedShift.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedShift),
            });
            if (response.ok) {
                setShowModal(false);
                fetchShifts(); // Refresh list
            }
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this shift?")) {
            try {
                const response = await fetch(`${API_URL}/shifts/${selectedShift.id}`, {
                    method: "DELETE",
                });
                if (response.ok) {
                    setShowModal(false);
                    fetchShifts(); // Refresh list
                }
            } catch (error) {
                console.error("Delete failed", error);
            }
        }
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>;

    return (
        <div>
            <h4 className="fw-bold mb-3">Available Shifts (Click to edit)</h4>
            <Row>
                {shifts.map(shift => (
                    <Col md={6} key={shift.id} className="mb-3">
                        <Card
                            className="shadow-sm border-0 h-100"
                            onClick={() => handleCardClick(shift)}
                            style={{ cursor: 'pointer' }}
                        >
                            <Card.Body>
                                <Badge bg={shift.type === 'GIVE AWAY' ? 'danger' : 'success'} className="mb-2">
                                    {shift.type}
                                </Badge>
                                <Card.Title>{shift.location}</Card.Title>
                                <div className="text-muted small">
                                    {shift.shift_date} | {shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Edit Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Shift</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedShift && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Type</Form.Label>
                                <Form.Select
                                    value={selectedShift.type}
                                    onChange={(e) => setSelectedShift({ ...selectedShift, type: e.target.value })}
                                >
                                    <option>GIVE AWAY</option>
                                    <option>TRADE</option>
                                    <option>PICK UP</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Location</Form.Label>
                                <Form.Control
                                    value={selectedShift.location}
                                    onChange={(e) => setSelectedShift({ ...selectedShift, location: e.target.value })}
                                />
                            </Form.Group>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Start Time</Form.Label>
                                        <Form.Control
                                            type="time"
                                            value={selectedShift.start_time}
                                            onChange={(e) => setSelectedShift({ ...selectedShift, start_time: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>End Time</Form.Label>
                                        <Form.Control
                                            type="time"
                                            value={selectedShift.end_time}
                                            onChange={(e) => setSelectedShift({ ...selectedShift, end_time: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                    <div>
                        <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleUpdate}>
                            Save Changes
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ShiftList;