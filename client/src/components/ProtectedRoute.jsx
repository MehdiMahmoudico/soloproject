import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.role !== 'ROLE_ADMIN') {
      return <Navigate to="/login" />;
    }
  } catch (error) {
    localStorage.removeItem('token');
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default ProtectedRoute;