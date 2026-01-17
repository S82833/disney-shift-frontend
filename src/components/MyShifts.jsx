import { useEffect, useState } from 'react';
import { Row, Col, Spinner, Alert, Container, Badge, Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../AuthContext';
import ShiftCard from './ShiftCard';

const API_URL = import.meta.env.VITE_API_URL;

export default function MyShifts() {
    const { token, logout } = useAuth();
    const [myShifts, setMyShifts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [showModal, setShowModal] = useState(false);
    const [selectedShift, setSelectedShift] = useState(null);

    const currentUsername = localStorage.getItem('username');

    const fetchMyShifts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/shifts/`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.status === 401) {
                logout();
                return;
            }

            const data = await response.json();
            // FILTER: Only shifts where YOU are the owner
            const filtered = data.filter(s => s.posted_by === currentUsername);
            setMyShifts(filtered);
        } catch (error) {
            console.error("Error fetching your shifts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchMyShifts();
    }, [token]);

    const handleCardClick = (shift) => {
        setSelectedShift({ ...shift }); // Create a copy to edit
        setShowModal(true);
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`${API_URL}/shifts/${selectedShift.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(selectedShift),
            });

            if (response.ok) {
                setShowModal(false);
                fetchMyShifts(); // Refresh the list
            } else if (response.status === 403) {
                alert("You don't have permission to edit this.");
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
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (response.ok) {
                    setShowModal(false);
                    fetchMyShifts(); // Refresh the list
                }
            } catch (error) {
                console.error("Delete failed", error);
            }
        }
    };

    if (loading) return (
        <Container className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
        </Container>
    );

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark">My Posted Shifts</h2>
                <Badge bg="primary" pill className="px-3 py-2">{myShifts.length} Active</Badge>
            </div>

            {myShifts.length === 0 ? (
                <Alert variant="info" className="text-center py-5 shadow-sm border-0">
                    <p className="mb-0 fs-5">You haven't posted any shifts yet.</p>
                </Alert>
            ) : (
                <Row>
                    {myShifts.map(shift => (
                        <Col md={6} lg={4} key={shift.id} className="mb-4">
                            <ShiftCard
                                shift={shift}
                                isOwner={true}
                                onClick={handleCardClick}
                            />
                        </Col>
                    ))}
                </Row>
            )}

            {/* MODAL FOR EDITING YOUR SHIFT */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold text-primary">Edit Your Shift</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedShift && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">SHIFT TYPE</Form.Label>
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
                                <Form.Label className="small fw-bold">LOCATION</Form.Label>
                                <Form.Control
                                    value={selectedShift.location}
                                    onChange={(e) => setSelectedShift({ ...selectedShift, location: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">DATE</Form.Label>
                                <Form.Control
                                    value={selectedShift.shift_date}
                                    onChange={(e) => setSelectedShift({ ...selectedShift, date: e.target.value })}
                                />
                            </Form.Group>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="small fw-bold">STARTS</Form.Label>
                                        <Form.Control
                                            type="time"
                                            value={selectedShift.start_time}
                                            onChange={(e) => setSelectedShift({ ...selectedShift, start_time: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="small fw-bold">ENDS</Form.Label>
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
                <Modal.Footer className="border-0 d-flex justify-content-between">
                    <Button variant="outline-danger" className="fw-bold" onClick={handleDelete}>
                        Delete Shift
                    </Button>
                    <div>
                        <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" className="fw-bold" onClick={handleUpdate}>
                            Save Changes
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}