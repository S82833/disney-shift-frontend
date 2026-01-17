import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Card, Form, Button, Container, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/token`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                login(data.access_token);
                localStorage.setItem('username', username);
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            setError('Connection error. Is the backend running?');
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center vh-100">
            <Card className="shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <h3 className="text-center mb-4 fw-bold">Cast Member Login</h3>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" required onChange={(e) => setUsername(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" required onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">Log In</Button>
                </Form>
                <div className="text-center mt-3">
                    <p className="small">New to the exchange? <Link to="/signup">Create an account</Link></p>
                </div>
            </Card>
        </Container>

    );
}