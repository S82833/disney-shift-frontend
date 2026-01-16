import { useState } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import ShiftForm from './components/ShiftForm';
import ShiftList from './components/ShiftList';

function App() {
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => setRefresh(!refresh);

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Navbar bg="primary" variant="dark" expand="lg" className="mb-4 shadow">
        <Container>
          <Navbar.Brand href="#">Disney Shift Exchange</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link href="#home">Epcot - Park Greeters</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container>
        <div className="row">
          <div className="col-lg-4">
            <ShiftForm onShiftCreated={triggerRefresh} />
          </div>
          <div className="col-lg-8">
            <ShiftList refreshTrigger={refresh} />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default App;