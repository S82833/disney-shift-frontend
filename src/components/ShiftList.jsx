import { useEffect, useState, useMemo } from 'react';
import { Row, Col, Spinner, Modal, Button, Form, Alert, Badge, Container, Accordion } from 'react-bootstrap';
import { useAuth } from '../AuthContext';
import ShiftCard from './ShiftCard';
import ContactModal from './ContactModal';

const API_URL = import.meta.env.VITE_API_URL;

// Helper to calculate total hours between two "HH:mm" strings
const calculateDuration = (start, end) => {
    if (!start || !end) return 0;
    const [startH, startM] = start.split(':').map(Number);
    let [endH, endM] = end.split(':').map(Number);

    const startTotal = startH * 60 + startM;
    let endTotal = endH * 60 + endM;

    // Handle shifts crossing midnight (e.g., 10 PM to 2 AM)
    if (endTotal < startTotal) {
        endTotal += 24 * 60;
    }

    return (endTotal - startTotal) / 60;
};

const ShiftList = () => {
    const { token, logout } = useAuth();
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUsername = localStorage.getItem('username');

    // --- FILTER STATES ---
    const [filters, setFilters] = useState({
        type: '',
        date: '',
        location: '',
        startTime: '',
        endTime: '',
        minHours: '' // This will now take typed input
    });

    // --- MODAL STATES ---
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedShift, setSelectedShift] = useState(null);
    const [showContactModal, setShowContactModal] = useState(false);
    const [contactData, setContactData] = useState({ info: '', user: '' });

    const fetchShifts = async () => {
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
            setShifts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchShifts();
    }, [token]);

    // --- ADVANCED FILTERING & SORTING LOGIC ---
    const filteredShifts = useMemo(() => {
        // 1. First, apply all your filters
        const filtered = shifts.filter(shift => {
            const matchType = filters.type === '' || shift.type === filters.type;
            const matchDate = filters.date === '' || shift.shift_date === filters.date;
            const matchLocation = filters.location === '' ||
                shift.location.toLowerCase().includes(filters.location.toLowerCase());
            const matchStart = filters.startTime === '' || shift.start_time >= filters.startTime;
            const matchEnd = filters.endTime === '' || shift.end_time <= filters.endTime;

            const duration = calculateDuration(shift.start_time, shift.end_time);
            const minHrs = parseFloat(filters.minHours);
            const matchHours = isNaN(minHrs) || duration >= minHrs;

            return matchType && matchDate && matchLocation && matchStart && matchEnd && matchHours;
        });

        // 2. Then, sort the filtered results
        return filtered.sort((a, b) => {
            // First Sort Criteria: Date (Nearest day first)
            if (a.shift_date !== b.shift_date) {
                return new Date(a.shift_date) - new Date(b.shift_date);
            }

            // Second Sort Criteria: Duration (Lowest hours to highest)
            const durationA = calculateDuration(a.start_time, a.end_time);
            const durationB = calculateDuration(b.start_time, b.end_time);

            return durationA - durationB;
        });
    }, [shifts, filters]);

    const handleClearFilters = () => {
        setFilters({ type: '', date: '', location: '', startTime: '', endTime: '', minHours: '' });
    };

    // --- EVENT HANDLERS ---
    const handleEditClick = (shift) => {
        setSelectedShift({ ...shift });
        setShowEditModal(true);
    };

    const handleContactClick = (shift) => {
        setContactData({ info: shift.contact_info, user: shift.posted_by });
        setShowContactModal(true);
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
                setShowEditModal(false);
                fetchShifts();
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
                    setShowEditModal(false);
                    fetchShifts();
                }
            } catch (error) {
                console.error("Delete failed", error);
            }
        }
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Loading Epcot Board...</p>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            {/* --- SEARCH & FILTER SECTION --- */}
            <Accordion className="mb-4 shadow-sm border-0">
                <Accordion.Item eventKey="0" className="border-0">
                    <Accordion.Header>
                        <span className="fw-bold text-primary">
                            <i className="bi bi-funnel me-2"></i> Search & Filter Shifts
                        </span>
                    </Accordion.Header>
                    <Accordion.Body className="bg-white rounded-bottom">
                        <Row className="g-3">
                            <Col md={4} lg={2}>
                                <Form.Label className="small fw-bold text-muted text-uppercase">Type</Form.Label>
                                <Form.Select
                                    value={filters.type}
                                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                >
                                    <option value="">All Types</option>
                                    <option>GIVE AWAY</option>
                                    <option>TRADE</option>
                                    <option>PICK UP</option>
                                </Form.Select>
                            </Col>
                            <Col md={8} lg={3}>
                                <Form.Label className="small fw-bold text-muted text-uppercase">Location</Form.Label>
                                <Form.Control
                                    placeholder="e.g. Greeter, Epcot..."
                                    value={filters.location}
                                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                />
                            </Col>
                            <Col md={4} lg={2}>
                                <Form.Label className="small fw-bold text-muted text-uppercase">Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={filters.date}
                                    onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                                />
                            </Col>

                            {/* --- UPDATED: TYPEABLE NUMBER INPUT --- */}
                            <Col md={4} lg={2}>
                                <Form.Label className="small fw-bold text-muted text-uppercase">Min Hours</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    placeholder="Min hours..."
                                    value={filters.minHours}
                                    onChange={(e) => setFilters({ ...filters, minHours: e.target.value })}
                                />
                            </Col>

                            <Col md={2} lg={1.5}>
                                <Form.Label className="small fw-bold text-muted text-uppercase">After</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={filters.startTime}
                                    onChange={(e) => setFilters({ ...filters, startTime: e.target.value })}
                                />
                            </Col>
                            <Col md={2} lg={1.5}>
                                <Form.Label className="small fw-bold text-muted text-uppercase">Before</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={filters.endTime}
                                    onChange={(e) => setFilters({ ...filters, endTime: e.target.value })}
                                />
                            </Col>
                        </Row>
                        <div className="text-end mt-3">
                            <Button variant="link" className="text-decoration-none text-muted small" onClick={handleClearFilters}>
                                Reset All Filters
                            </Button>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            {/* --- RESULTS HEADER --- */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold m-0 text-dark">Shift Board</h4>
                <Badge bg="primary" className="px-3 py-2">{filteredShifts.length} Matches Found</Badge>
            </div>

            {/* --- LIST --- */}
            {filteredShifts.length === 0 ? (
                <Alert variant="light" className="text-center py-5 border shadow-sm">
                    <i className="bi bi-info-circle fs-2 text-muted d-block mb-3"></i>
                    No shifts found matching your search.
                </Alert>
            ) : (
                <Row>
                    {filteredShifts.map(shift => (
                        <Col md={6} lg={4} key={shift.id} className="mb-4">
                            <ShiftCard
                                shift={shift}
                                isOwner={shift.posted_by === currentUsername}
                                onClick={handleEditClick}
                                onContactClick={handleContactClick}
                            />
                        </Col>
                    ))}
                </Row>
            )}

            {/* --- MANAGEMENT MODAL --- */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold text-primary">
                        {selectedShift?.posted_by === currentUsername ? 'Manage My Shift' : 'Shift Details'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedShift && (
                        <Form>
                            <fieldset disabled={selectedShift.posted_by !== currentUsername}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-muted text-uppercase">Type</Form.Label>
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
                                    <Form.Label className="small fw-bold text-muted text-uppercase">Location</Form.Label>
                                    <Form.Control
                                        value={selectedShift.location}
                                        onChange={(e) => setSelectedShift({ ...selectedShift, location: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-muted text-uppercase">Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={selectedShift.shift_date}
                                        onChange={(e) => setSelectedShift({ ...selectedShift, shift_date: e.target.value })}
                                    />
                                </Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small fw-bold text-muted text-uppercase">Start</Form.Label>
                                            <Form.Control
                                                type="time"
                                                value={selectedShift.start_time}
                                                onChange={(e) => setSelectedShift({ ...selectedShift, start_time: e.target.value })}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small fw-bold text-muted text-uppercase">End</Form.Label>
                                            <Form.Control
                                                type="time"
                                                value={selectedShift.end_time}
                                                onChange={(e) => setSelectedShift({ ...selectedShift, end_time: e.target.value })}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </fieldset>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0">
                    {selectedShift?.posted_by === currentUsername ? (
                        <div className="d-flex justify-content-between w-100">
                            <Button variant="outline-danger" onClick={handleDelete}>Delete</Button>
                            <div>
                                <Button variant="secondary" className="me-2" onClick={() => setShowEditModal(false)}>Cancel</Button>
                                <Button variant="primary" onClick={handleUpdate}>Save Changes</Button>
                            </div>
                        </div>
                    ) : (
                        <Button variant="primary" className="w-100 fw-bold" onClick={() => setShowEditModal(false)}>
                            Close
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            <ContactModal
                show={showContactModal}
                onHide={() => setShowContactModal(false)}
                contactInfo={contactData.info}
                username={contactData.user}
            />
        </Container>
    );
};

export default ShiftList;