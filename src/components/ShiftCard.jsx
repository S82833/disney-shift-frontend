import { Card, Badge, Button } from 'react-bootstrap';

const ShiftCard = ({ shift, onClick, isOwner, onContactClick }) => {

    // Determine badge color based on shift type
    const getBadgeColor = (type) => {
        if (type === 'GIVE AWAY') return 'danger';
        if (type === 'TRADE') return 'warning'; // Bootstrap 'warning' is orange/yellow
        return 'success'; // Default for PICK UP
    };

    const handleContact = (e) => {
        e.stopPropagation();
        onContactClick(shift);
    };

    return (
        <Card
            className={`shadow-sm border-0 h-100 transition card-hover ${isOwner ? 'border-start border-primary border-4' : 'border-start border-light border-4'
                }`}
            onClick={() => onClick(shift)}
            style={{ cursor: 'pointer' }}
        >
            <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    {/* UPDATED COLOR LOGIC HERE */}
                    <Badge bg={getBadgeColor(shift.type)} className="text-dark px-2 py-1">
                        {shift.type}
                    </Badge>
                    {isOwner && <Badge bg="primary" pill>Yours</Badge>}
                </div>

                <Card.Title className="h6 fw-bold mb-1 text-dark">
                    {shift.location}
                </Card.Title>

                <div className="text-muted small mb-3">
                    <div className="mb-1">
                        <i className="bi bi-calendar3 me-2"></i>{shift.shift_date}
                    </div>
                    <div>
                        <i className="bi bi-clock me-2"></i>
                        {shift.start_time?.slice(0, 5)} - {shift.end_time?.slice(0, 5)}
                    </div>
                </div>

                <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                    <div className="small fw-bold text-primary">
                        {isOwner ? 'You posted this' : `By: ${shift.posted_by}`}
                    </div>

                    {!isOwner && (
                        <Button
                            variant="outline-primary"
                            size="sm"
                            className="fw-bold px-3"
                            onClick={handleContact}
                        >
                            Contact
                        </Button>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};

export default ShiftCard;