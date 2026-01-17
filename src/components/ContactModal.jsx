import { Modal, Button, InputGroup, Form } from 'react-bootstrap';
import { useState } from 'react';

export default function ContactModal({ show, onHide, contactInfo, username }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(contactInfo);
        setCopied(true);
        // Volver el botón a la normalidad después de 2 segundos
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Modal show={show} onHide={onHide} centered size="sm">
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold h5">Contact {username}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-3">
                <Form.Label className="small text-muted fw-bold text-uppercase">Contact Information</Form.Label>
                <InputGroup className="mb-3">
                    <Form.Control
                        value={contactInfo || "No data"}
                        readOnly
                        className="bg-light border-0"
                    />
                    <Button
                        variant={copied ? "success" : "primary"}
                        onClick={handleCopy}
                        style={{
                            transition: 'all 0.3s ease',
                            transform: copied ? 'scale(1.05)' : 'scale(1)'
                        }}
                    >Copy
                        <i className={`bi ${copied ? 'bi-check-lg' : 'bi-clipboard'}`}></i>
                    </Button>
                </InputGroup>
                {copied && <p className="text-success small fw-bold text-center mb-0">Copied!</p>}
            </Modal.Body>
            <Modal.Footer className="border-0 pt-0">
                <Button variant="light" className="w-100" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}