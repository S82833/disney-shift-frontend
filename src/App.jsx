import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './components/Login';
import Signup from './Signup';
import ShiftForm from './components/ShiftForm';
import ShiftList from './components/ShiftList';
import MyShifts from './components/MyShifts';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function MainApp() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <div className="container mt-4">
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <PrivateRoute>
              <ShiftList />
            </PrivateRoute>
          } />

          <Route path="/post" element={
            <PrivateRoute>
              <ShiftForm />
            </PrivateRoute>
          } />

          <Route path="/my-shifts" element={
            <PrivateRoute>
              <MyShifts />
            </PrivateRoute>} />

          {/* Redirect any unknown route to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}