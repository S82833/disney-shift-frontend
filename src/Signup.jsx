import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Button, Container, Alert, InputGroup } from 'react-bootstrap';

export default function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        contact_info: '', // New field for Social Media or Phone
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // 1. Validation: Passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // 2. Validation: Password length
        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    contact_info: formData.contact_info,
                    password: formData.password
                }),
            });

            if (response.ok) {
                // Success! Redirect to login with a message
                navigate('/login', { state: { message: 'Account created! Please log in with your new credentials.' } });
            } else {
                const data = await response.json();
                setError(data.detail || 'Registration failed. That username or email might be taken.');
            }
        } catch (err) {
            setError('Connection error. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100 py-5">
            <Card className="shadow-lg border-0 p-4" style={{ maxWidth: '450px', width: '100%' }}>
                <Card.Body>
                    <div className="text-center mb-4">
                        <h2 className="fw-bold text-primary">Join the Exchange</h2>
                        <p className="text-muted small">Create your account to start trading shifts</p>
                    </div>

                    {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        {/* USERNAME */}
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Username</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                placeholder="Choose a unique username"
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </Form.Group>

                        {/* EMAIL */}
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Disney Email</Form.Label>
                            <Form.Control
                                type="email"
                                required
                                placeholder="name@disney.com"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </Form.Group>

                        {/* CONTACT INFO (SOCIALS / PHONE) */}
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Contact Info</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                placeholder="Messenger, Instagram, WhatsApp, or Phone #"
                                onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                            />
                            <Form.Text className="text-muted" style={{ fontSize: '0.75rem' }}>
                                This is how coworkers will reach out to you to confirm a trade.
                            </Form.Text>
                        </Form.Group>

                        <hr className="my-4" />

                        {/* PASSWORD */}
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Password</Form.Label>
                            <Form.Control
                                type="password"
                                required
                                placeholder="Min. 8 characters"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </Form.Group>

                        {/* CONFIRM PASSWORD */}
                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold">Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                required
                                placeholder="Repeat your password"
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 fw-bold py-2 shadow-sm"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </Button>
                    </Form>

                    <div className="text-center mt-4">
                        <p className="small text-muted mb-0">
                            Already a member? <Link to="/login" className="text-primary fw-bold text-decoration-none">Log In</Link>
                        </p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}