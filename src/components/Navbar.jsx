import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Navbar as BsNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';

export default function Navbar() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const currentUsername = localStorage.getItem('username');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <BsNavbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
            <Container>
                {/* Brand Logo */}
                <BsNavbar.Brand as={Link} to="/" className="fw-bold">
                    Disney Shift Exchange
                </BsNavbar.Brand>

                {/* Mobile Toggle */}
                <BsNavbar.Toggle aria-controls="basic-navbar-nav" />

                <BsNavbar.Collapse id="basic-navbar-nav">
                    {/* Main Navigation Links */}
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">View Shifts</Nav.Link>
                        <Nav.Link as={Link} to="/post">Post New Shift</Nav.Link>
                    </Nav>

                    {/* User Dropdown Menu */}
                    <Nav>
                        {currentUsername && (
                            <NavDropdown
                                title={<span>My Profile</span>}
                                id="user-nav-dropdown"
                                align="end" // Ensures the list doesn't go off-screen on the right
                            >
                                <NavDropdown.Item as={Link} to="/my-shifts">
                                    My Shifts
                                </NavDropdown.Item>

                                <NavDropdown.Divider />

                                <NavDropdown.Item onClick={handleLogout} className="text-danger">
                                    Log Out
                                </NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </BsNavbar.Collapse>
            </Container>
        </BsNavbar>
    );
}