import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import "../build/css/Navbar.css";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  let userRole = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userRole = decoded.role;
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Travel Agency
      </Link>
      <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <Link to="/trips">Trips</Link>
        
        {isAuthenticated ? (
          <>
          {userRole === 'ROLE_USER' && (<>
            <Link to="/my-reservations">My Reservations</Link></>)}
            
            {userRole === 'ROLE_ADMIN' && (
              <>
                <Link to="/createtrip">Add Trip</Link>
                <Link to="/admin-dashboard">Dashboard</Link>
              </>
            )}
            
            <button onClick={handleLogout} className="auth-button">
              Logout
            </button>
          </>
        ) : (
          <div className="nav-links">
            {/*<Link to="/login">Login</Link>*/}
            <Link to="/login" className="auth-button">
            Login
            </Link>
          </div>
        )}
      </div>

      {/* Hamburger Menu for Mobile */}
      <div className="hamburger-menu" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </nav>
  );
};

export default Navbar;
