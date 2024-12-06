import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const UserRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  
  let isUser = false;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      isUser = decoded.role === 'ROLE_USER';
    } catch (error) {
      console.error('Invalid token', error);
      localStorage.removeItem('token');
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default UserRoute;