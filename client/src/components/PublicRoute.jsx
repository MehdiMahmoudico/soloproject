import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.role === 'ROLE_ADMIN') {
        return <Navigate to="/admin-dashboard" />;
      } else if (decoded.role === 'ROLE_USER') {
        return <Navigate to="/user-dashboard" />;
      }
    } catch (error) {
      localStorage.removeItem('token');
    }
  }

  return children;
};

export default PublicRoute;